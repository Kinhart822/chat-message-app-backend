import { Module } from '@nestjs/common';
import { ConversationRepository } from '@repositories/conversation.repository';
import { MessageRepository } from '@repositories/message.repository';
import { ParticipantRepository } from '@repositories/participant.repository';
import { SystemConfigRepository } from '@repositories/system-config.repository';
import { UserRepository } from '@repositories/user.repository';
import { TypeOrmExModule } from '@shared/decorators/typeorm.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { SystemConfigService } from './system-config.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      UserRepository,
      ConversationRepository,
      MessageRepository,
      ParticipantRepository,
      SystemConfigRepository,
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService, SystemConfigService],
  exports: [AdminService, SystemConfigService],
})
export class AdminModule {}
