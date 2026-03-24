import { SystemConfigModule } from '@modules/system-config/system-config.module';
import { Module } from '@nestjs/common';
import { FriendshipRepository } from '@repositories/friendship.repository';
import { UserRepository } from '@repositories/user.repository';
import { TypeOrmExModule } from '@shared/decorators/typeorm.module';
import { FriendshipController } from './friendship.controller';
import { FriendshipService } from './friendship.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([FriendshipRepository, UserRepository]),
    SystemConfigModule,
  ],
  controllers: [FriendshipController],
  providers: [FriendshipService],
  exports: [FriendshipService],
})
export class FriendshipModule {}
