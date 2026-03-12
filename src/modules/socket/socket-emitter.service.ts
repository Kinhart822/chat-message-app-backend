import { SocketEvent, getUserRoomByEmail } from '@constants/socket.constant';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Emitter } from '@socket.io/redis-emitter';
import { RedisClientType } from 'redis';
import { SocketEventDto } from './dto/socket-emitter.dto';

@Injectable()
export class SocketEmitterService implements OnModuleInit {
  private __emitter: Emitter;
  private readonly logger = new Logger(SocketEmitterService.name);

  constructor(
    @Inject('REDIS')
    private readonly redisClient: RedisClientType,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.initEmitter();
  }

  private async initEmitter(): Promise<void> {
    this.__emitter = new Emitter(this.redisClient);
  }

  get emitter(): Emitter {
    return this.__emitter;
  }

  /**
   * Generic method to emit event to a specific user via their email room
   */
  emitEvent(email: string, event: SocketEvent, data: any): void {
    try {
      const room = getUserRoomByEmail(email.toLowerCase());
      const payload: SocketEventDto = { event, data };

      this.logger.log(`Emitting event ${event} to room ${room}`);
      this.__emitter.to(room).emit(event, payload);
    } catch (error) {
      this.logger.error(
        `Failed to emit event ${event} to user ${email}`,
        error.stack,
      );
    }
  }

  // User Events
  emitUserStatusChange(email: string, data: any): void {
    this.emitEvent(email, SocketEvent.USER_STATUS_CHANGE, data);
  }

  emitUserProfileUpdate(email: string, data: any): void {
    this.emitEvent(email, SocketEvent.PROFILE_UPDATE, data);
  }

  emitUserProfileStatusChangek(email: string, data: any): void {
    this.emitEvent(email, SocketEvent.PROFILE_STATUS_CHANGE, data);
  }

  // Message Events
  emitNewMessage(email: string, data: any): void {
    this.emitEvent(email, SocketEvent.NEW_MESSAGE, data);
  }

  emitEditMessage(email: string, data: any): void {
    this.emitEvent(email, SocketEvent.EDIT_MESSAGE, data);
  }

  emitDeleteMessage(email: string, data: any): void {
    this.emitEvent(email, SocketEvent.DELETE_MESSAGE, data);
  }

  // Friend Events
  emitSendFriendRequest(email: string, data: any): void {
    this.emitEvent(email, SocketEvent.SEND_FRIEND_REQUEST, data);
  }

  emitFriendRequestStatusChange(email: string, data: any): void {
    this.emitEvent(email, SocketEvent.FRIEND_REQUEST_STATUS_CHANGE, data);
  }

  emitRemoveFriend(email: string, data: any): void {
    this.emitEvent(email, SocketEvent.REMOVE_FRIEND, data);
  }

  emitBlockFriend(email: string, data: any): void {
    this.emitEvent(email, SocketEvent.BLOCK_FRIEND, data);
  }

  emitUnblockFriend(email: string, data: any): void {
    this.emitEvent(email, SocketEvent.UNBLOCK_FRIEND, data);
  }

  // Group Events
  emitCreateGroup(email: string, data: any): void {
    this.emitEvent(email, SocketEvent.CREATE_GROUP, data);
  }

  emitEditGroup(email: string, data: any): void {
    this.emitEvent(email, SocketEvent.EDIT_GROUP, data);
  }

  emitAddMemberToGroup(email: string, data: any): void {
    this.emitEvent(email, SocketEvent.ADD_MEMBER_TO_GROUP, data);
  }

  emitRemoveMemberFromGroup(email: string, data: any): void {
    this.emitEvent(email, SocketEvent.REMOVE_MEMBER_FROM_GROUP, data);
  }

  emitLeaveGroup(email: string, data: any): void {
    this.emitEvent(email, SocketEvent.LEAVE_GROUP, data);
  }
}
