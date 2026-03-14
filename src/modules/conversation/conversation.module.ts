import { Module } from '@nestjs/common';
import { ConversationRepository } from '@repositories/conversation.repository';
import { MessageRepository } from '@repositories/message.repository';
import { ParticipantRepository } from '@repositories/participant.repository';
import { UserRepository } from '@repositories/user.repository';
import { TypeOrmExModule } from '@shared/decorators/typeorm.module';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      UserRepository,
      ConversationRepository,
      MessageRepository,
      ParticipantRepository,
    ]),
  ],
  controllers: [ConversationController],
  providers: [ConversationService],
  exports: [ConversationService],
})
export class ConversationModule {}
