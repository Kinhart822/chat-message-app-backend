import { RoleUser } from '@constants/user.constant';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from '@shared/decorators/guard.decorator';
import { AdminService } from './admin.service';
import {
  CreateConfigRequestDto,
  DeleteConfigRequestDto,
  SystemConfigFilterDto,
  UpdateConfigRequestDto,
} from './dto/admin.req.dto';
import { SystemConfigService } from './system-config.service';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
@RoleGuard(RoleUser.ADMIN)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly systemConfigService: SystemConfigService,
  ) {}

  // ==================== SYSTEM CONFIG ====================

  // GET SYSTEM CONFIG
  @Get('system-config/:key')
  @ApiOperation({ summary: 'Get a system config by key' })
  async getConfig(@Param('key') key: string) {
    return this.systemConfigService.getConfig(key);
  }

  // GET SYSTEM CONFIG LIST
  @Get('system-config')
  @ApiOperation({ summary: 'Get paginated list of system configs' })
  async getSystemConfigs(@Query() filter: SystemConfigFilterDto) {
    return this.systemConfigService.getSystemConfigs(filter);
  }

  // CREATE SYSTEM CONFIG
  @Post('system-config/create')
  @ApiOperation({ summary: 'Create a new system config' })
  async createSystemConfig(@Body() dto: CreateConfigRequestDto) {
    return this.systemConfigService.createSystemConfig(dto.key, dto.value);
  }

  // UPDATE SYSTEM CONFIG
  @Put('system-config/update')
  @ApiOperation({ summary: 'Update an existing system config' })
  async updateSystemConfig(@Body() dto: UpdateConfigRequestDto) {
    return this.systemConfigService.updateSystemConfig(dto.key, dto.value);
  }

  // DELETE SYSTEM CONFIG
  @Delete('system-config/delete')
  @ApiOperation({ summary: 'Delete a system config by key' })
  async deleteSystemConfig(@Body() dto: DeleteConfigRequestDto) {
    return this.systemConfigService.deleteSystemConfig(dto.key);
  }
}
