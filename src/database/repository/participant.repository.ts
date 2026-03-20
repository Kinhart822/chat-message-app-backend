import { Order } from '@constants/pagination.constant';
import { ParticipantEntity } from '@entities/participant.entity';
import { ParticipantFilterDto } from '@modules/user/dto/participant.req.dto';
import { CustomRepository } from '@shared/decorators/typeorm.decorator';
import { BaseRepository } from './base.repository';

@CustomRepository(ParticipantEntity)
export class ParticipantRepository extends BaseRepository<ParticipantEntity> {
  async getParticipantsWithFilters(
    conversationId: number,
    filterDto: ParticipantFilterDto,
  ): Promise<{ entities: ParticipantEntity[]; total: number }> {
    const { keyword, statuses, roles } = filterDto;

    const queryBuilder = this.createQueryBuilder('participant')
      .leftJoinAndSelect('participant.user', 'user')
      .where('participant.conversationId = :conversationId', {
        conversationId,
      });

    if (keyword) {
      queryBuilder.andWhere('user.email LIKE :keyword', {
        keyword: `%${keyword}%`,
      });
    }

    if (statuses && statuses.length > 0) {
      queryBuilder.andWhere('participant.status IN (:...statuses)', {
        statuses,
      });
    }

    if (roles && roles.length > 0) {
      queryBuilder.andWhere('participant.role IN (:...roles)', {
        roles,
      });
    }

    queryBuilder.orderBy(
      `participant.createdAt`,
      filterDto.direction || Order.DESC,
    );
    queryBuilder.skip(filterDto.skip).take(filterDto.limit);

    const [entities, total] = await queryBuilder.getManyAndCount();
    return { entities, total };
  }

  async incrementUnreadCount(
    conversationId: number,
    excludeUserId: number,
  ): Promise<void> {
    await this.createQueryBuilder()
      .update(ParticipantEntity)
      .set({ unreadCount: () => 'unread_count + 1' })
      .where('conversationId = :conversationId', { conversationId })
      .andWhere('userId != :userId', { userId: excludeUserId })
      .execute();
  }
}
