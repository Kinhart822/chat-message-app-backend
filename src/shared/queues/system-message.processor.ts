import {
  SYSTEM_MESSAGE_JOB,
  SYSTEM_MESSAGE_QUEUE,
} from '@constants/queue.constant';
import {
  ConversationStatus,
  ConversationType,
  MessageStatus,
  MessageType,
  ParticipantRole,
  ParticipantStatus,
  RoleUser,
  UserStatus,
} from '@constants/user.constant';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { ConversationRepository } from '@repositories/conversation.repository';
import { MessageRepository } from '@repositories/message.repository';
import { ParticipantRepository } from '@repositories/participant.repository';
import { UserRepository } from '@repositories/user.repository';
import { Job } from 'bullmq';
import { SocketEmitterService } from '../../modules/socket/socket-emitter.service';

@Processor(SYSTEM_MESSAGE_QUEUE)
export class SystemMessageProcessor extends WorkerHost {
  private readonly logger = new Logger(SystemMessageProcessor.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly conversationRepository: ConversationRepository,
    private readonly participantRepository: ParticipantRepository,
    private readonly messageRepository: MessageRepository,
    private readonly socketEmitterService: SocketEmitterService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case SYSTEM_MESSAGE_JOB.SEND_BROADCAST:
        return this.handleSendBroadcast(job);
      default:
        this.logger.warn(`Unknown job name: ${job.name}`);
    }
  }

  private async handleSendBroadcast(job: Job<any>) {
    const { adminId, content } = job.data;
    this.logger.log(`Starting system broadcast from admin ${adminId}`);

    // Get all active users
    const users = await this.userRepository.find({
      where: { role: RoleUser.USER, status: UserStatus.ACTIVE },
      select: ['id', 'email'],
    });

    if (users.length === 0) return;

    for (const user of users) {
      try {
        // Find or Create Direct Conversation between Admin and User
        let conversation = await this.conversationRepository
          .createQueryBuilder('c')
          .innerJoin('c.participants', 'p1', 'p1.userId = :userId', {
            userId: adminId,
          })
          .innerJoin('c.participants', 'p2', 'p2.userId = :targetId', {
            targetId: user.id,
          })
          .where('c.type = :type', { type: ConversationType.DIRECT })
          .getOne();

        if (!conversation) {
          // Create new direct conversation
          conversation = await this.conversationRepository.save(
            this.conversationRepository.create({
              type: ConversationType.DIRECT,
              ownerId: adminId,
              status: ConversationStatus.ACTIVE,
            }),
          );

          // Add participants
          await this.participantRepository.save([
            this.participantRepository.create({
              conversationId: conversation.id,
              userId: adminId,
              role: ParticipantRole.OWNER,
              status: ParticipantStatus.ACTIVE,
              joinedAt: new Date(),
            }),
            this.participantRepository.create({
              conversationId: conversation.id,
              userId: user.id,
              role: ParticipantRole.MEMBER,
              status: ParticipantStatus.ACTIVE,
              joinedAt: new Date(),
            }),
          ]);
        }

        // Find Admin Participant ID
        const adminParticipant = await this.participantRepository.findOneBy({
          conversationId: conversation.id,
          userId: adminId,
        });

        // Send SYSTEM message
        const message = await this.messageRepository.save(
          this.messageRepository.create({
            conversationId: conversation.id,
            senderParticipantId: adminParticipant.id,
            content: content,
            type: MessageType.SYSTEM,
            status: MessageStatus.SENT,
            sequence: Number(conversation.lastMessageSeq || 0) + 1,
          }),
        );

        // Update Conversation Summary
        await this.conversationRepository.update(conversation.id, {
          lastMessageSeq: message.sequence,
          lastMessagePreview: message.content,
          lastMessageType: message.type,
          lastMessageSenderId: adminParticipant.id,
          lastMessageAt: message.createdAt,
        });

        // Increment unread for the user
        await this.participantRepository.incrementUnreadCount(
          conversation.id,
          user.id,
        );

        // Emit new message via socket
        this.socketEmitterService.emitNewMessage(conversation.id, message);
      } catch (err) {
        this.logger.error(
          `Failed to send system message to user ${user.id}`,
          err.stack,
        );
      }
    }

    this.logger.log(`Broadcast from admin ${adminId} completed`);
  }
}
