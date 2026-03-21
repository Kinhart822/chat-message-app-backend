import { Module } from '@nestjs/common';
import { FriendshipController } from './friendship.controller';
import { FriendshipService } from './friendship.service';
import { TypeOrmExModule } from '@shared/decorators/typeorm.module';
import { FriendshipRepository } from '@repositories/friendship.repository';
import { UserRepository } from '@repositories/user.repository';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([FriendshipRepository, UserRepository]),
  ],
  controllers: [FriendshipController],
  providers: [FriendshipService],
  exports: [FriendshipService],
})
export class FriendshipModule {}
