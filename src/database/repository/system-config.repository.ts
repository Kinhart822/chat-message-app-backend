import { CustomRepository } from '@shared/decorators/typeorm.decorator';
import { SystemConfigEntity } from '../entities/system-config.entity';
import { BaseRepository } from './base.repository';

@CustomRepository(SystemConfigEntity)
export class SystemConfigRepository extends BaseRepository<SystemConfigEntity> {}
