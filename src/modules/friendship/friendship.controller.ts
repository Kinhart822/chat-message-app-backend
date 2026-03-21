import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Friendship')
@ApiBearerAuth()
@Controller('friendship')
export class FriendshipController {}
