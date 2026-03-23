import {
  FriendshipRequestAction,
  FriendshipStatus,
} from '@constants/user.constant';
import { FriendshipEntity } from '@entities/friendship.entity';
import { Injectable } from '@nestjs/common';
import { FriendshipRepository } from '@repositories/friendship.repository';
import { UserRepository } from '@repositories/user.repository';
import { PageMetaDto } from '@shared/dtos/page-meta.dto';
import { PageDto } from '@shared/dtos/page.dto';
import { httpBadRequest, httpErrors } from '@shared/exceptions/http-exception';
import { plainToInstance } from 'class-transformer';
import { Transactional } from 'typeorm-transactional';
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

  // ==================== GET INFO FRIENDSHIP ====================
  async getInfoFriendship(friendshipId: number): Promise<FriendshipResDto> {
    const friendship = await this.friendshipRepository.findOne({
      where: {
        id: friendshipId,
      },
    });
    if (!friendship) {
      throw new httpBadRequest(
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

  // ==================== SEND FRIEND REQUEST ====================
  @Transactional()
  async sendFriendRequest(userId: number, dto: SendFriendRequestDto) {
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
      throw new httpBadRequest(
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
    const friendship = await this.friendshipRepository.findOne({
      where: { id: dto.friendshipId },
    });

    if (!friendship) {
      throw new httpBadRequest(
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
}
