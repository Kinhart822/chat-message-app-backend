import { CustomRepository } from '@/shared/decorators/typeorm.decorator';
import { UserEntity } from '../entities/user-entity';
import { BaseRepository } from './base.repository';

@CustomRepository(UserEntity)
export class UserRepository extends BaseRepository<UserEntity> {}
