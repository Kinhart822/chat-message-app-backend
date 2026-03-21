import { FriendshipStatus, UserStatus } from '@constants/user.constant';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class FriendshipResDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  userId: number;

  @ApiProperty()
  @Expose()
  friendId: number;

  @ApiProperty()
  @Expose()
  status: FriendshipStatus;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => (value ? new Date(value).toISOString() : null))
  createdAt: string;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => (value ? new Date(value).toISOString() : null))
  updatedAt: string;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => (value ? new Date(value).toISOString() : null))
  deletedAt: string;
}
