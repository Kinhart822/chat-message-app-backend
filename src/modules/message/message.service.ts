import { Injectable } from '@nestjs/common';
import { ConversationRepository } from '@repositories/conversation.repository';
import { MessageRepository } from '@repositories/message.repository';
import { ParticipantRepository } from '@repositories/participant.repository';
import { SocketEmitterService } from '../socket/socket-emitter.service';

@Injectable()
export class MessageService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly conversationRepository: ConversationRepository,
    private readonly participantRepository: ParticipantRepository,
    private readonly socketEmitterService: SocketEmitterService,
  ) {}
}
