import { ParticipantRole, ParticipantStatus } from '@constants/user.constant';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '../../shared/base-entity';
import { ConversationEntity } from './conversation.entity';
import { MessageEntity } from './message.entity';
import { UserEntity } from './user.entity';

import { MessagePinEntity } from './message-pin.entity';

@Entity('participants')
@Index(['conversationId', 'userId'], { unique: true })
export class ParticipantEntity extends BaseEntity {
  @Column({ name: 'user_id', type: 'int', nullable: false })
  userId: number;

  @Column({ name: 'conversation_id', type: 'int', nullable: false })
  conversationId: number;

  @Column({
    name: 'role',
    type: 'enum',
    enum: ParticipantRole,
    default: ParticipantRole.MEMBER,
  })
  role: ParticipantRole;

  @Column({
    name: 'status',
    type: 'enum',
    enum: ParticipantStatus,
    default: ParticipantStatus.ACTIVE,
  })
  status: ParticipantStatus;

  @Column({
    name: 'joined_at',
    type: 'timestamp',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  joinedAt: Date;

  @Column({
    name: 'left_at',
    type: 'timestamp',
    nullable: true,
  })
  leftAt: Date;

  @Column({
    name: 'unread_count',
    type: 'int',
    nullable: false,
    default: 0,
  })
  unreadCount: number;

  @Column({
    name: 'last_read_seq',
    type: 'bigint',
    nullable: true,
    default: 0,
  })
  lastReadSeq: number;

  @Column({
    name: 'mute_until',
    type: 'timestamp',
    nullable: true,
  })
  muteUntil: Date;

  @Column({
    name: 'is_pinned',
    type: 'boolean',
    default: false,
  })
  isPinned: boolean;

  @ManyToOne(() => UserEntity, (user) => user.participants)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(
    () => ConversationEntity,
    (conversation) => conversation.participants,
  )
  @JoinColumn({ name: 'conversation_id' })
  conversation: ConversationEntity;

  @OneToMany(() => MessageEntity, (message) => message.sender)
  messages: MessageEntity[];

  @OneToMany(() => MessagePinEntity, (pin) => pin.pinnedByParticipant)
  pinnedMessages: MessagePinEntity[];
}
