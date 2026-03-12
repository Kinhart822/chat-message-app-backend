import { CustomRepository } from '@shared/decorators/typeorm.decorator';
import { BaseRepository } from './base.repository';
import { AuditLogEntity } from 'database/entities/audit-log.entity';

@CustomRepository(AuditLogEntity)
export class AuditLogRepository extends BaseRepository<AuditLogEntity> {}
