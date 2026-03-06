import { AuthUser, PublicRoute } from '@/shared/decorators/guard.decorator';
import { JwtPayloadDto } from '@/shared/dtos/jwt-payload.dto';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginBodyRequestDto,
  RefreshTokenRequestDto,
  RegisterRequestDto,
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
  async login(@Body() dto: LoginBodyRequestDto) {
    return this.authService.signIn(dto);
  }

  @Post('logout')
  async logout(@AuthUser() user: JwtPayloadDto) {
    return this.authService.logout(user.id);
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
  @Get('google/callback')
  async googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req);
  }
}
