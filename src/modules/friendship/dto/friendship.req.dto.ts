import { Order } from '@constants/pagination.constant';
import {
  FriendshipRequestAction,
  FriendshipStatus,
} from '@constants/user.constant';
import { ApiProperty } from '@nestjs/swagger';
import { EnumFieldOptional } from '@shared/decorators/field.decorator';
import { ToArray } from '@shared/decorators/transform.decorator';
import { PageOptionsDto } from '@shared/dtos/page-option.dto';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class SendFriendRequestDto {
  @IsInt()
  @ApiProperty({
    type: Number,
    description: 'Friend user id',
    example: 1,
    required: true,
  })
  friendUserId: number;
}

export class ProcessFriendRequestDto {
  @IsInt()
  @ApiProperty({
    type: Number,
    description: 'Friendship request id',
    example: 1,
    required: true,
  })
  friendshipId: number;

  @IsEnum(FriendshipRequestAction)
  @ApiProperty({
    description: 'Friendship request status (ACCEPT, REJECT)',
    example: FriendshipRequestAction.ACCEPT,
    required: true,
    enum: FriendshipRequestAction,
  })
  action: FriendshipRequestAction;
}

export class FriendshipFilterDto extends PageOptionsDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Search by keyword in email or username',
    required: false,
    type: String,
  })
  readonly keyword?: string;

  @ApiProperty({
    description:
      'List of friendship statuses to filter (PENDING, ACCEPTED, REJECTED, BLOCKED)',
    example: ['PENDING', 'ACCEPTED', 'REJECTED', 'BLOCKED'],
    required: false,
    isArray: true,
    enum: FriendshipStatus,
  })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty({ message: 'statuses array cannot be empty' })
  @IsEnum(FriendshipStatus, { each: true })
  @ToArray()
  readonly statuses: FriendshipStatus[];

  @EnumFieldOptional(() => Order, {
    default: Order.DESC,
  })
  readonly direction: Order = Order.DESC;
}
