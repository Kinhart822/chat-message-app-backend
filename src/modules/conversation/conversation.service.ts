import { Injectable } from '@nestjs/common';
import { ConversationRepository } from '@repositories/conversation.repository';
import { ParticipantRepository } from '@repositories/participant.repository';
import { UserRepository } from '@repositories/user.repository';
import { SocketEmitterService } from '../socket/socket-emitter.service';

@Injectable()
export class ConversationService {
  constructor(
    private readonly conversationRepository: ConversationRepository,
    private readonly userRepository: UserRepository,
    private readonly participantRepository: ParticipantRepository,
    private readonly socketEmitterService: SocketEmitterService,
  ) {}
}
