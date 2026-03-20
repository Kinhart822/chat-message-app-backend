import { Injectable } from '@nestjs/common';
import { ConversationRepository } from '@repositories/conversation.repository';
import { MessageRepository } from '@repositories/message.repository';
import { ParticipantRepository } from '@repositories/participant.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly conversationRepository: ConversationRepository,
    private readonly participantRepository: ParticipantRepository,
    private readonly messageRepository: MessageRepository,
  ) {}
}
