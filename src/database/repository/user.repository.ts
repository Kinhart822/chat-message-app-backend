import { Order } from '@constants/pagination.constant';
import { RoleUser } from '@constants/user.constant';
import { AdminFilterDto } from '@modules/admin/dto/admin.req.dto';
import { CustomRepository } from '@shared/decorators/typeorm.decorator';
import { UserEntity } from '../entities/user.entity';
import { BaseRepository } from './base.repository';

@CustomRepository(UserEntity)
export class UserRepository extends BaseRepository<UserEntity> {
  async getAdminListByFilter(
    filterDto: AdminFilterDto,
  ): Promise<{ entities: UserEntity[]; total: number }> {
    const { keyword, statuses, direction } = filterDto;
    const queryBuilder = this.createQueryBuilder('user').where(
      'user.role = :role',
      { role: RoleUser.ADMIN },
    );

    if (statuses) {
      queryBuilder.andWhere('user.status IN (:...statuses)', { statuses });
    }

    if (keyword) {
      queryBuilder.andWhere(
        'user.email ILIKE :keyword OR user.username ILIKE :keyword',
        {
          keyword: `%${keyword}%`,
        },
      );
    }

    queryBuilder
      .orderBy('user.createdAt', direction || Order.DESC)
      .skip(filterDto.skip)
      .take(filterDto.limit);

    const [entities, total] = await queryBuilder.getManyAndCount();
    return { entities, total };
  }
}
