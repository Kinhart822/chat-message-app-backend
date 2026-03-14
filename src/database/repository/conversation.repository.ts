import { ConversationEntity } from '@entities/conversation.entity';
import { CustomRepository } from '@shared/decorators/typeorm.decorator';
import { BaseRepository } from './base.repository';

@CustomRepository(ConversationEntity)
export class ConversationRepository extends BaseRepository<ConversationEntity> {}
