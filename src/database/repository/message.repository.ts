import { MessageEntity } from '@entities/message.entity';
import { CustomRepository } from '@shared/decorators/typeorm.decorator';
import { BaseRepository } from './base.repository';

@CustomRepository(MessageEntity)
export class MessageRepository extends BaseRepository<MessageEntity> {}
