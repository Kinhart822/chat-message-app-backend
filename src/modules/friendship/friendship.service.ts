import {
  FriendshipRequestAction,
  FriendshipStatus,
  SYSTEM_CONFIG_KEYS,
  UserStatus,
} from '@constants/user.constant';
import { FriendshipEntity } from '@entities/friendship.entity';
import { SystemConfigService } from '@modules/system-config/system-config.service';
import { Injectable } from '@nestjs/common';
import { FriendshipRepository } from '@repositories/friendship.repository';
import { UserRepository } from '@repositories/user.repository';
import { PageMetaDto } from '@shared/dtos/page-meta.dto';
import { PageDto } from '@shared/dtos/page.dto';
import {
  httpBadRequest,
  httpErrors,
  httpForbidden,
  httpNotFound,
} from '@shared/exceptions/http-exception';
import { plainToInstance } from 'class-transformer';
import { Between } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { endOfDay, startOfDay } from '../../utils/date';
import {
  FriendshipFilterDto,
  ProcessFriendRequestDto,
  SendFriendRequestDto,
} from './dto/friendship.req.dto';
import { FriendshipResDto } from './dto/friendship.res.dto';

@Injectable()
export class FriendshipService {
  constructor(
    private readonly friendshipRepository: FriendshipRepository,
    private readonly userRepository: UserRepository,
    private readonly systemConfigService: SystemConfigService,
  ) {}

  /**
   * Map conversation to response DTO
   */
  private mapFriendshipToResponse(
    friendship: FriendshipEntity,
  ): FriendshipResDto {
    return plainToInstance(FriendshipResDto, friendship, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Validate user is active (not blocked or deleted)
   */
  private async validateUserIsActive(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new httpNotFound(
        httpErrors.ACCOUNT_NOT_FOUND.message,
        httpErrors.ACCOUNT_NOT_FOUND.code,
      );
    }

    if (user.status === UserStatus.BLOCKED) {
      throw new httpForbidden(
        httpErrors.BLOCKED_USER.message,
        httpErrors.BLOCKED_USER.code,
      );
    }

    if (user.status === UserStatus.DELETED) {
      throw new httpForbidden(
        httpErrors.ACCOUNT_DELETED.message,
        httpErrors.ACCOUNT_DELETED.code,
      );
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new httpForbidden(
        httpErrors.FORBIDDEN.message,
        httpErrors.FORBIDDEN.code,
      );
    }
  }

  // ==================== GET INFO FRIENDSHIP ====================
  async getInfoFriendship(friendshipId: number): Promise<FriendshipResDto> {
    const friendship = await this.friendshipRepository.findOne({
      where: {
        id: friendshipId,
      },
    });
    if (!friendship) {
      throw new httpNotFound(
        httpErrors.FRIENDSHIP_NOT_FOUND.message,
        httpErrors.FRIENDSHIP_NOT_FOUND.code,
      );
    }
    return this.mapFriendshipToResponse(friendship);
  }

  // ==================== GET FRIENDS ====================
  async getFriends(
    userId: number,
    filterDto: FriendshipFilterDto,
  ): Promise<PageDto<FriendshipResDto>> {
    const { entities, total } =
      await this.friendshipRepository.getFriendshipsWithFilters(
        userId,
        filterDto,
      );

    const mappedItems = entities.map((friendship) => {
      return this.mapFriendshipToResponse(friendship);
    });

    const meta = new PageMetaDto(filterDto, total);
    return new PageDto(mappedItems, meta);
  }

  // ==================== GET PENDING REQUESTS ====================
  async getPendingRequests(userId: number): Promise<FriendshipResDto[]> {
    const friendships = await this.friendshipRepository.find({
      where: { friendId: userId, status: FriendshipStatus.PENDING },
      relations: ['user'],
    });

    return friendships.map((friendship) =>
      this.mapFriendshipToResponse(friendship),
    );
  }

  // ==================== CHECK FRIENDSHIP ====================
  async checkFriendship(user1: number, user2: number): Promise<boolean> {
    const friendship = await this.friendshipRepository.findOne({
      where: [
        { userId: user1, friendId: user2, status: FriendshipStatus.ACCEPTED },
        { userId: user2, friendId: user1, status: FriendshipStatus.ACCEPTED },
      ],
    });
    return !!friendship;
  }

  /**
   * Check if either user has blocked the other
   */
  async checkBlocked(user1: number, user2: number): Promise<boolean> {
    const friendship = await this.friendshipRepository.findOne({
      where: [
        { userId: user1, friendId: user2, status: FriendshipStatus.BLOCKED },
        { userId: user2, friendId: user1, status: FriendshipStatus.BLOCKED },
      ],
    });
    return !!friendship;
  }

  // ==================== SEND FRIEND REQUEST ====================
  @Transactional()
  async sendFriendRequest(userId: number, dto: SendFriendRequestDto) {
    // Validate user is active
    await this.validateUserIsActive(userId);

    // Check if user is trying to send friend request to self
    if (userId === dto.friendUserId) {
      throw new httpBadRequest(
        httpErrors.CANNOT_SEND_FRIEND_REQUEST_TO_SELF.message,
        httpErrors.CANNOT_SEND_FRIEND_REQUEST_TO_SELF.code,
      );
    }

    // Check if the friend user exists
    const friend = await this.userRepository.findOne({
      where: { id: dto.friendUserId },
    });
    if (!friend) {
      throw new httpNotFound(
        httpErrors.ACCOUNT_NOT_FOUND.message,
        httpErrors.ACCOUNT_NOT_FOUND.code,
      );
    }

    // Check if there is an existing friendship
    const existingFriendship = await this.friendshipRepository.findOne({
      where: [
        { userId, friendId: dto.friendUserId },
        { userId: dto.friendUserId, friendId: userId },
      ],
    });

    if (
      existingFriendship &&
      existingFriendship.status === FriendshipStatus.BLOCKED
    ) {
      throw new httpForbidden(
        httpErrors.BLOCKED_USER.message,
        httpErrors.BLOCKED_USER.code,
      );
    }

    // Check Limit for Requests
    const maxRequestsConfig = await this.systemConfigService.getConfig(
      SYSTEM_CONFIG_KEYS.MAX_FRIEND_REQUESTS_PER_DAY,
    );
    const maxRequests = parseInt(maxRequestsConfig.value || '20', 10);

    const requestsCount = await this.friendshipRepository.count({
      where: {
        userId,
        createdAt: Between(startOfDay(new Date()), endOfDay(new Date())),
      },
    });

    if (requestsCount >= maxRequests) {
      throw new httpBadRequest(
        httpErrors.MAX_FRIEND_REQUESTS_PER_DAY_EXCEEDED.message,
        httpErrors.MAX_FRIEND_REQUESTS_PER_DAY_EXCEEDED.code,
      );
    }

    if (existingFriendship) {
      if (existingFriendship.status === FriendshipStatus.ACCEPTED) {
        throw new httpBadRequest(
          httpErrors.FRIENDSHIP_ALREADY_EXISTED.message,
          httpErrors.FRIENDSHIP_ALREADY_EXISTED.code,
        );
      }
      if (existingFriendship.status === FriendshipStatus.PENDING) {
        throw new httpBadRequest(
          httpErrors.FRIEND_REQUEST_ALREADY_PENDING.message,
          httpErrors.FRIEND_REQUEST_ALREADY_PENDING.code,
        );
      }

      // If rejected, allow re-sending
      existingFriendship.status = FriendshipStatus.PENDING;
      existingFriendship.userId = userId;
      existingFriendship.friendId = dto.friendUserId;

      return this.friendshipRepository.save(existingFriendship);
    }

    // Create new friendship request
    const friendship = this.friendshipRepository.create({
      userId,
      friendId: dto.friendUserId,
      status: FriendshipStatus.PENDING,
    });
    return this.friendshipRepository.save(friendship);
  }

  // ==================== PROCESS FRIEND REQUEST ====================
  @Transactional()
  async processFriendRequest(userId: number, dto: ProcessFriendRequestDto) {
    // Validate user is active
    await this.validateUserIsActive(userId);

    const friendship = await this.friendshipRepository.findOne({
      where: { id: dto.friendshipId },
    });

    if (!friendship) {
      throw new httpNotFound(
        httpErrors.FRIEND_REQUEST_NOT_FOUND.message,
        httpErrors.FRIEND_REQUEST_NOT_FOUND.code,
      );
    }

    if (friendship.status !== FriendshipStatus.PENDING) {
      throw new httpBadRequest(
        httpErrors.FRIEND_REQUEST_NOT_PENDING.message,
        httpErrors.FRIEND_REQUEST_NOT_PENDING.code,
      );
    }

    if (friendship.friendId !== userId) {
      throw new httpBadRequest(
        httpErrors.CANNOT_SELF_PROCESS_FRIEND_REQUEST.message,
        httpErrors.CANNOT_SELF_PROCESS_FRIEND_REQUEST.code,
      );
    }

    friendship.status =
      dto.action === FriendshipRequestAction.ACCEPT
        ? FriendshipStatus.ACCEPTED
        : FriendshipStatus.REJECTED;
    return this.friendshipRepository.save(friendship);
  }

  // ==================== BLOCK USER ====================
  @Transactional()
  async blockUser(userId: number, friendUserId: number) {
    if (userId === friendUserId) {
      throw new httpBadRequest(
        httpErrors.CANNOT_BLOCK_SELF.message,
        httpErrors.CANNOT_BLOCK_SELF.code,
      );
    }

    const friendship = await this.friendshipRepository.findOne({
      where: [
        { userId, friendId: friendUserId },
        { userId: friendUserId, friendId: userId },
      ],
    });

    if (!friendship) {
      throw new httpBadRequest(
        httpErrors.FRIENDSHIP_NOT_FOUND.message,
        httpErrors.FRIENDSHIP_NOT_FOUND.code,
      );
    }

    if (friendship.status === FriendshipStatus.BLOCKED) {
      throw new httpBadRequest(
        httpErrors.FRIENDSHIP_ALREADY_BLOCKED.message,
        httpErrors.FRIENDSHIP_ALREADY_BLOCKED.code,
      );
    }

    friendship.status = FriendshipStatus.BLOCKED;
    friendship.blockedBy = userId;
    return this.friendshipRepository.save(friendship);
  }

  // ==================== UNBLOCK USER ====================
  @Transactional()
  async unblockUser(userId: number, friendUserId: number) {
    const friendship = await this.friendshipRepository.findOne({
      where: [
        { userId, friendId: friendUserId },
        { userId: friendUserId, friendId: userId },
      ],
    });

    if (!friendship) {
      throw new httpBadRequest(
        httpErrors.FRIENDSHIP_NOT_FOUND.message,
        httpErrors.FRIENDSHIP_NOT_FOUND.code,
      );
    }

    if (friendship.status !== FriendshipStatus.BLOCKED) {
      throw new httpBadRequest(
        httpErrors.FRIENDSHIP_NOT_BLOCKED.message,
        httpErrors.FRIENDSHIP_NOT_BLOCKED.code,
      );
    }

    if (friendship.blockedBy !== userId) {
      throw new httpForbidden(
        httpErrors.CANNOT_UNBLOCK_USER.message,
        httpErrors.CANNOT_UNBLOCK_USER.code,
      );
    }

    friendship.status = FriendshipStatus.ACCEPTED;
    friendship.blockedBy = null;
    return this.friendshipRepository.save(friendship);
  }
}
