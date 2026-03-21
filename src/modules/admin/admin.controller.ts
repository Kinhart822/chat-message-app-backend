import { RoleUser } from '@constants/user.constant';
import { Controller, UseGuards } from '@nestjs/common';
import { RoleGuard } from '@shared/decorators/guard.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(JwtAuthGuard)
@RoleGuard(RoleUser.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
}
