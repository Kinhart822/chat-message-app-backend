import { Order } from '@constants/pagination.constant';
import { UserStatus } from '@constants/user.constant';
import { ApiProperty } from '@nestjs/swagger';
import {
  EnumFieldOptional,
  StringField,
} from '@shared/decorators/field.decorator';
import { ToArray } from '@shared/decorators/transform.decorator';
import { PageOptionsDto } from '@shared/dtos/page-option.dto';
import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class AdminFilterDto extends PageOptionsDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Search by keyword in username or email',
    required: false,
    type: String,
  })
  readonly keyword?: string;

  @ApiProperty({
    description:
      'List of conversation statuses to filter (ACTIVE, INACTIVE, BLOCKED, DELETED)',
    example: ['ACTIVE', 'INACTIVE', 'BLOCKED', 'DELETED'],
    required: false,
    isArray: true,
    enum: UserStatus,
  })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty({ message: 'statuses array cannot be empty' })
  @IsEnum(UserStatus, { each: true })
  @ToArray()
  readonly statuses?: UserStatus[];

  @EnumFieldOptional(() => Order, {
    default: Order.DESC,
  })
  readonly direction: Order = Order.DESC;
}

export class CreateAdminDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @StringField()
  password: string;

  @ApiProperty()
  @StringField()
  username: string;

  @IsOptional()
  @ApiProperty()
  @StringField()
  description?: string;
}

export class UpdateAdminDto {
  @IsOptional()
  @ApiProperty()
  @IsEmail()
  email?: string;

  @IsOptional()
  @ApiProperty()
  @StringField()
  password?: string;

  @IsOptional()
  @ApiProperty()
  @StringField()
  username?: string;

  @IsOptional()
  @ApiProperty()
  @StringField()
  description?: string;
}

export class ActionDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  reason?: string;
}

export class AccountHistoryFilterDto extends PageOptionsDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Search by keyword in reason',
    required: false,
    type: String,
  })
  readonly keyword?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description:
      'Filter by type (REGISTER, SIGN_IN, BLOCKED, UNBLOCKED, DELETED)',
    required: false,
    type: String,
  })
  type?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Filter by status (ACTIVE, INACTIVE, BLOCKED, DELETED)',
    required: false,
    type: String,
  })
  status?: string;

  @EnumFieldOptional(() => Order, {
    default: Order.DESC,
  })
  readonly direction: Order = Order.DESC;
}

export class SystemNotificationDto {
  @ApiProperty({ description: 'Notification message content' })
  @IsString()
  @IsNotEmpty()
  content: string;
}
