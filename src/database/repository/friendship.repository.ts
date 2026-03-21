import { CustomRepository } from '@shared/decorators/typeorm.decorator';
import { FriendshipEntity } from '../entities/friendship.entity';
import { BaseRepository } from './base.repository';

@CustomRepository(FriendshipEntity)
export class FriendshipRepository extends BaseRepository<FriendshipEntity> {}
