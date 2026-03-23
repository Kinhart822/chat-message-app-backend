import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../shared/base-entity';
import { UserEntity } from './user.entity';
import { FriendshipStatus } from '@constants/user.constant';

@Entity('friendships')
export class FriendshipEntity extends BaseEntity {
  @Column({ name: 'user_id', type: 'int', nullable: false })
  userId: number;

  @Column({ name: 'friend_id', type: 'int', nullable: false })
  friendId: number;

  @Column({
    type: 'enum',
    enum: FriendshipStatus,
    default: FriendshipStatus.PENDING,
  })
  status: FriendshipStatus;

  @Column({ name: 'blocked_by', type: 'int', nullable: true })
  blockedBy: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'friend_id' })
  friend: UserEntity;
}
