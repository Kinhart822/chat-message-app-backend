import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthUser, PublicRoute } from '@shared/decorators/guard.decorator';
import { JwtPayloadDto } from '@shared/dtos/jwt-payload.dto';
import { AuditLogInterceptor } from 'interceptors/audit-log.interceptor';
import { AuthService } from './auth.service';
import {
  EmailBodyRequestDto,
  LoginBodyRequestDto,
  RefreshTokenRequestDto,
  RegisterRequestDto,
  ResendCodeRequestDto,
  ResetPasswordRequestDto,
  VerifyEmailCodeRequestDto,
} from './dtos/auth.request.dto';
import { GoogleAuthGuard } from './guards/google-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @PublicRoute()
  async registerUser(@Body() dto: RegisterRequestDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @PublicRoute()
  @UseInterceptors(AuditLogInterceptor)
  async login(@Body() dto: LoginBodyRequestDto) {
    return this.authService.signIn(dto);
  }

  @Post('logout')
  @UseInterceptors(AuditLogInterceptor)
  async logout(@AuthUser() user: JwtPayloadDto) {
    return this.authService.logout(user.id);
  }

  @Post('verify-otp')
  @PublicRoute()
  async verifyOtp(@Body() dto: VerifyEmailCodeRequestDto) {
    return this.authService.verifyOtpAndExecuteAction(
      dto.email,
      dto.code,
      dto.type,
    );
  }

  @Post('forgot-password')
  @PublicRoute()
  async forgotPassword(@Body() dto: EmailBodyRequestDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  @PublicRoute()
  async resetPassword(@Body() dto: ResetPasswordRequestDto) {
    return this.authService.resetPassword(dto);
  }

  @Post('resend-code')
  @PublicRoute()
  async resendCode(@Body() dto: ResendCodeRequestDto) {
    return this.authService.resendCode(dto);
  }

  @Post('refresh-token')
  @PublicRoute()
  async refreshToken(@Body() dto: RefreshTokenRequestDto) {
    return this.authService.refreshToken(dto);
  }

  @UseGuards(GoogleAuthGuard)
  @PublicRoute()
  @Get('google')
  async googleAuth() {}

  @UseGuards(GoogleAuthGuard)
  @PublicRoute()
  @UseInterceptors(AuditLogInterceptor)
  @Get('google/callback')
  async googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req);
  }
}
