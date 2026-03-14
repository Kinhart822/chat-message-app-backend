import { MESSAGE_JOB, MESSAGE_QUEUE } from '@constants/queue.constant';
import {
  MessageAttachmentStatus,
  MessageStatus,
} from '@constants/user.constant';
import { CloudinaryService } from '@modules/cloudinary/cloudinary.service';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { ConversationRepository } from '@repositories/conversation.repository';
import { MessageAttachmentRepository } from '@repositories/message-attachment.repository';
import { MessageRepository } from '@repositories/message.repository';
import { Job } from 'bullmq';
import { SocketEmitterService } from '../socket/socket-emitter.service';

@Processor(MESSAGE_QUEUE)
export class MessageProcessor extends WorkerHost {
  private readonly logger = new Logger(MessageProcessor.name);

  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly messageAttachmentRepository: MessageAttachmentRepository,
    private readonly messageRepository: MessageRepository,
    private readonly conversationRepository: ConversationRepository,
    private readonly socketEmitterService: SocketEmitterService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case MESSAGE_JOB.UPLOAD_ATTACHMENT:
        return this.handleUploadAttachment(job);
      case MESSAGE_JOB.UPLOAD_CONVERSATION_AVATAR:
        return this.handleUploadConversationAvatar(job);
      default:
        this.logger.warn(`Unknown job name: ${job.name}`);
    }
  }

  private async handleUploadConversationAvatar(job: Job<any>) {
    const { conversationId, file } = job.data;
    const buffer = Buffer.from(file.buffer.data);
    const multerFile: Express.Multer.File = {
      ...file,
      buffer,
    } as any;

    try {
      const res = await this.cloudinaryService.uploadFile(multerFile);
      const avatarUrl = (res as any).secure_url;

      await this.conversationRepository.update(conversationId, {
        avatarUrl,
      });

      this.socketEmitterService.emitUpdateConversationAvatar(conversationId, {
        conversationId,
        avatarUrl,
      });

      this.logger.log(`Avatar of conversation ${conversationId} updated`);
    } catch (error) {
      this.logger.error(
        `Failed to upload avatar for conversation ${conversationId}`,
        error.stack,
      );

      // Emit failure status
      this.socketEmitterService.emitUpdateConversationAvatar(conversationId, {
        conversationId,
        avatarUrl: null,
        status: 'FAILED',
      });
    }
  }

  private async handleUploadAttachment(job: Job<any>) {
    const { messageId, attachmentId, file, conversationId } = job.data;

    const buffer = Buffer.from(file.buffer.data);
    const multerFile: Express.Multer.File = {
      ...file,
      buffer,
    } as any;

    try {
      const res = await this.cloudinaryService.uploadFile(multerFile);
      const mediaType = this.cloudinaryService.getMediaTypeFromResult(res);

      const updateData = {
        type: mediaType,
        status: MessageAttachmentStatus.SUCCESS,
        url: (res as any).secure_url,
        size: (res as any).bytes,
        duration: (res as any).duration
          ? Math.round((res as any).duration)
          : null,
        mimeType: (res as any).resource_type + '/' + (res as any).format,
      };

      await this.messageAttachmentRepository.update(attachmentId, updateData);

      // Verify message status
      await this.messageRepository.update(messageId, {
        status: MessageStatus.SENT,
      });

      // Notify clients via Socket
      this.socketEmitterService.emitUpdateAttachment(conversationId, {
        messageId,
        attachment: {
          id: attachmentId,
          ...updateData,
        },
      });

      this.logger.log(`Attachment ${attachmentId} uploaded successfully`);
    } catch (error) {
      this.logger.error(
        `Failed to upload attachment ${attachmentId}`,
        error.stack,
      );

      await this.messageAttachmentRepository.update(attachmentId, {
        status: MessageAttachmentStatus.FAILED,
      });

      // Emit failure status
      this.socketEmitterService.emitUpdateAttachment(conversationId, {
        messageId,
        attachment: {
          id: attachmentId,
          status: MessageAttachmentStatus.FAILED,
        },
      });
    }
  }
}
