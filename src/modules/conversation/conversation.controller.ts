import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ConversationService } from './conversation.service';

@ApiTags('Conversation')
@ApiBearerAuth()
@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}
}
