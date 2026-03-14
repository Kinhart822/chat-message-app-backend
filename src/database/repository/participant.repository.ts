import { ParticipantEntity } from '@entities/participant.entity';
import { CustomRepository } from '@shared/decorators/typeorm.decorator';
import { BaseRepository } from './base.repository';

@CustomRepository(ParticipantEntity)
export class ParticipantRepository extends BaseRepository<ParticipantEntity> {}
