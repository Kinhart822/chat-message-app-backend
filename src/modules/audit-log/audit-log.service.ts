import { Injectable, Logger } from '@nestjs/common';
import { AuditLogRepository } from '@repositories/audit-log.repository';
import { CreateAuditLogDto } from './dtos/audit-log-request.dto';

@Injectable()
export class AuditLogService {
  private readonly logger = new Logger(AuditLogService.name);

  constructor(private readonly auditLogRepository: AuditLogRepository) {}

  async createAuditLog(payload: CreateAuditLogDto) {
    try {
      const log = this.auditLogRepository.create(payload as any);
      return await this.auditLogRepository.save(log);
    } catch (err) {
      this.logger.error('Failed to save audit log', err.stack);
      return null;
    }
  }
}
