import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AccountHistoryResDto {
  @ApiProperty({
    type: Number,
    description: 'User ID',
  })
  @Expose({ name: 'id' })
  userId: number;

  @ApiProperty({
    type: String,
    description: 'Reason',
  })
  @Expose()
  reason: string;

  @ApiProperty({
    type: String,
    description: 'Status',
  })
  @Expose()
  status: string;

  @ApiProperty({
    type: Number,
    description: 'User ID',
  })
  @Expose()
  actionBy: number;

  @ApiProperty({
    type: String,
    description: 'Type',
  })
  @Expose()
  type: string;
}

export class AdminDashboardResDto {
  @ApiProperty()
  totalUsers: number;

  @ApiProperty()
  activeUsers: number;

  @ApiProperty()
  inactiveUsers: number;

  @ApiProperty()
  blockedUsers: number;

  @ApiProperty()
  deletedUsers: number;

  @ApiProperty()
  totalMessages: number;

  @ApiProperty()
  messagesToday: number;

  @ApiProperty()
  totalConversations: number;
}
