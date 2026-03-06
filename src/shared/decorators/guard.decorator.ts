import { GUARD_ROUTE_KEY, PUBLIC_ROUTE_KEY } from '@/constants/guard.constant';
import { RoleUser } from '@/constants/user.constant';
import {
  applyDecorators,
  createParamDecorator,
  CustomDecorator,
  ExecutionContext,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';

export const PublicRoute = (): CustomDecorator =>
  SetMetadata(PUBLIC_ROUTE_KEY, true);

export function RoleGuard(...roles: RoleUser[]): MethodDecorator {
  return applyDecorators(
    SetMetadata(GUARD_ROUTE_KEY, roles),
    UseGuards(JwtAuthGuard, RolesGuard),
    ApiBearerAuth(),
  );
}

export function AuthUser() {
  return createParamDecorator((_data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return user;
  })();
}
