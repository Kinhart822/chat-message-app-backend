import { Column, Entity, OneToMany } from 'typeorm';
import {
  AccessMethod,
  RoleUser,
  UserStatus,
} from '../../constants/user.constant';
import { BaseEntity } from '../../shared/base-entity';
import { ParticipantEntity } from './participant.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column({ default: '' })
  email: string;

  @Column({ name: 'password', nullable: true })
  password: string;

  @Column({ name: 'username', nullable: true })
  username: string;

  @Column({ name: 'full_name', nullable: true })
  fullName: string;

  @Column({ name: 'avatar', nullable: true })
  avatar: string;

  @Column({ name: 'description', nullable: true })
  description: string;

  @Column({ name: 'status', type: 'enum', enum: UserStatus, nullable: false })
  status: UserStatus;

  @Column({
    name: 'access_method',
    type: 'enum',
    enum: AccessMethod,
    nullable: false,
  })
  accessMethod: AccessMethod;

  @Column({ name: 'google_id', nullable: true })
  googleId: string;

  @Column({
    name: 'role',
    type: 'enum',
    enum: RoleUser,
    default: RoleUser.USER,
  })
  role: RoleUser;

  @OneToMany(() => ParticipantEntity, (participant) => participant.user)
  participants: ParticipantEntity[];
}
