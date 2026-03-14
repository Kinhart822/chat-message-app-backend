import { CloudinaryModule } from '@modules/cloudinary/cloudinary.module';
import { Module } from '@nestjs/common';
import { ConversationRepository } from '@repositories/conversation.repository';
import { MessageAttachmentRepository } from '@repositories/message-attachment.repository';
import { MessagePinRepository } from '@repositories/message-pin.repository';
import { MessageRepository } from '@repositories/message.repository';
import { ParticipantRepository } from '@repositories/participant.repository';
import { UserRepository } from '@repositories/user.repository';
import { TypeOrmExModule } from '@shared/decorators/typeorm.module';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';

import { BullModule } from '@nestjs/bullmq';
import { MESSAGE_QUEUE } from '@constants/queue.constant';
import { MessageProcessor } from './message.processor';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      UserRepository,
      ConversationRepository,
      MessageRepository,
      ParticipantRepository,
      MessageAttachmentRepository,
      MessagePinRepository,
    ]),
    CloudinaryModule,
    BullModule.registerQueue({
      name: MESSAGE_QUEUE,
    }),
  ],
  controllers: [MessageController],
  providers: [MessageService, MessageProcessor],
  exports: [MessageService],
})
export class MessageModule {}
