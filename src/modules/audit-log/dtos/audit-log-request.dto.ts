import { Optional } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsIP,
  IsNumber,
  IsObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';

import { AuditLogStatus } from '@constants/audit.constant';
import {
  IsUnixTimestamp,
  StringField,
} from '@shared/decorators/field.decorator';

export class DeviceInfoDto {
  @IsObject()
  browser: any;

  @IsObject()
  os: any;

  @IsObject()
  device: any;
}

export class CreateAuditLogDto {
  @IsNumber()
  userId: number;

  @StringField()
  endpoint: string;

  @IsUnixTimestamp()
  @Optional()
  timestamp: number = Math.floor(new Date().getTime() / 1000);

  @IsIP(4)
  @IsOptional()
  ipAddress?: string;

  @ValidateNested()
  @Type(() => DeviceInfoDto)
  @IsOptional()
  deviceInfo?: DeviceInfoDto;

  @StringField()
  @IsOptional()
  geolocation?: string;

  @StringField()
  @IsOptional()
  note?: string;

  @IsObject()
  details: any;

  @IsEnum(AuditLogStatus)
  status: AuditLogStatus;
}
