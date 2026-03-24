import { SystemConfigFilterDto } from '@modules/system-config/dto/system-config.req.dto';
import { CustomRepository } from '@shared/decorators/typeorm.decorator';
import { SystemConfigEntity } from '../entities/system-config.entity';
import { BaseRepository } from './base.repository';
import { Order } from '@constants/pagination.constant';

@CustomRepository(SystemConfigEntity)
export class SystemConfigRepository extends BaseRepository<SystemConfigEntity> {
  async getSystemConfigsWithFilters(
    filterDto: SystemConfigFilterDto,
  ): Promise<{ entities: SystemConfigEntity[]; total: number }> {
    const queryBuilder = this.createQueryBuilder('systemConfig');

    if (filterDto.keyword) {
      queryBuilder.andWhere('systemConfig.key LIKE :keyword', {
        keyword: `%${filterDto.keyword}%`,
      });
    }

    queryBuilder
      .skip(filterDto.skip)
      .take(filterDto.limit)
      .orderBy('systemConfig.createdAt', filterDto.direction || Order.DESC);

    const [entities, total] = await queryBuilder.getManyAndCount();
    return { entities, total };
  }
}
