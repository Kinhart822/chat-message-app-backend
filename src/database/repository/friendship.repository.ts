import { FriendshipFilterDto } from '@modules/friendship/dto/friendship.req.dto';
import { CustomRepository } from '@shared/decorators/typeorm.decorator';
import { FriendshipEntity } from '../entities/friendship.entity';
import { BaseRepository } from './base.repository';
import { Order } from '@constants/pagination.constant';

@CustomRepository(FriendshipEntity)
export class FriendshipRepository extends BaseRepository<FriendshipEntity> {
  async getFriendshipsWithFilters(
    userId: number,
    filterDto: FriendshipFilterDto,
  ): Promise<{ entities: FriendshipEntity[]; total: number }> {
    const { keyword, statuses, direction } = filterDto;

    const query = this.createQueryBuilder('f')
      .innerJoinAndSelect('f.user', 'user')
      .innerJoinAndSelect('f.friend', 'friend');

    if (userId) {
      query.andWhere('(f.userId = :userId OR f.friendId = :userId)', {
        userId,
      });
    }

    if (statuses && statuses.length > 0) {
      query.andWhere('f.status IN (:...statuses)', { statuses });
    }

    if (keyword) {
      const searchValue = `%${keyword.trim().toLowerCase()}%`;
      query.andWhere(
        '(user.username ILIKE :keyword OR user.email ILIKE :keyword OR friend.username ILIKE :keyword OR friend.email ILIKE :keyword)',
        {
          keyword: searchValue,
        },
      );
    }

    query.orderBy('f.createdAt', direction || Order.DESC);
    query.skip(filterDto.skip).take(filterDto.limit);

    const [entities, total] = await query.getManyAndCount();
    return { entities, total };
  }
}
