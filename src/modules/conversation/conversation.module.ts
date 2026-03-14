import { CloudinaryModule } from '@modules/cloudinary/cloudinary.module';
import { Module } from '@nestjs/common';
import { ConversationRepository } from '@repositories/conversation.repository';
import { MessageRepository } from '@repositories/message.repository';
import { ParticipantRepository } from '@repositories/participant.repository';
import { UserRepository } from '@repositories/user.repository';
import { TypeOrmExModule } from '@shared/decorators/typeorm.module';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';

import { BullModule } from '@nestjs/bullmq';
import { MESSAGE_QUEUE } from '@constants/queue.constant';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      UserRepository,
      ConversationRepository,
      MessageRepository,
      ParticipantRepository,
    ]),
    CloudinaryModule,
    BullModule.registerQueue({
      name: MESSAGE_QUEUE,
    }),
  ],
  controllers: [ConversationController],
  providers: [ConversationService],
  exports: [ConversationService],
})
export class ConversationModule {}
