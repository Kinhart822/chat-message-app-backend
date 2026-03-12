import { IMailType } from '@constants/mail.constant';
import { ApiProperty } from '@nestjs/swagger';
import { StringField } from '@shared/decorators/field.decorator';
import { IsEmail, IsEnum, IsJWT, IsNotEmpty } from 'class-validator';

export class EmailBodyRequestDto {
  @IsEmail()
  @ApiProperty({
    type: String,
    description: 'Email address',
    example: 'user@example.com',
  })
  @StringField({
    toLowerCase: true,
  })
  email: string;
}

export class RegisterRequestDto extends EmailBodyRequestDto {
  @StringField()
  @ApiProperty({
    type: String,
    description: 'Username',
    example: 'john',
  })
  username: string;

  @StringField()
  @ApiProperty({
    type: String,
    description: 'Password',
    example: '123456',
  })
  password: string;
}

export class LoginBodyRequestDto extends EmailBodyRequestDto {
  @StringField()
  @ApiProperty({
    type: String,
    description: 'Password',
    example: '123456',
  })
  password: string;
}

export class RefreshTokenRequestDto {
  @IsNotEmpty()
  @IsJWT()
  @ApiProperty({
    type: String,
    description: 'Refresh token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpvaG4iLCJpYXQiOjE2NzkzOTI4NDAsImV4cCI6MTY3OTk5NzY0MH0._Jj0t_m7Vp4awrdlFDoM7bQt4gxvtXC8tSsCQGQFB84',
  })
  refreshToken: string;
}

export class VerifyEmailCodeRequestDto extends EmailBodyRequestDto {
  @StringField()
  @ApiProperty({
    type: String,
    description: 'Verification code',
    required: true,
    example: '123456',
  })
  code: string;
}

export class ResendCodeRequestDto extends EmailBodyRequestDto {
  @IsNotEmpty()
  @IsEnum(IMailType)
  @ApiProperty({
    enum: IMailType,
    description: 'Type of mail action',
    example: IMailType.SIGN_UP,
  })
  type: IMailType;
}

export class ResetPasswordRequestDto extends VerifyEmailCodeRequestDto {
  @StringField()
  @ApiProperty({
    type: String,
    description: 'New password',
    example: 'new_password123',
  })
  password: string;
}
