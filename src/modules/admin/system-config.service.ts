import { Injectable } from '@nestjs/common';
import { SystemConfigRepository } from '@repositories/system-config.repository';

@Injectable()
export class SystemConfigService {
  constructor(
    private readonly systemConfigRepository: SystemConfigRepository,
  ) {}
}
