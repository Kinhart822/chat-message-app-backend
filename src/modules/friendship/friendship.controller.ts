import { RoleUser } from '@constants/user.constant';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthUser, RoleGuard } from '@shared/decorators/guard.decorator';
import { JwtPayloadDto } from '@shared/dtos/jwt-payload.dto';
import {
  FriendshipFilterDto,
  ProcessFriendRequestDto,
  SendFriendRequestDto,
} from './dto/friendship.req.dto';
import { FriendshipService } from './friendship.service';

@ApiTags('Friendship')
@ApiBearerAuth()
@Controller('friendship')
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  @Get(':id/info')
  @ApiOperation({
    summary: 'Get friendship info',
    description: 'Returns friendship details by ID.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Friendship info returned successfully',
  })
  @RoleGuard(RoleUser.USER)
  async getInfoFriendship(@Param('id') id: string) {
    return this.friendshipService.getInfoFriendship(+id);
  }

  @Get()
  @ApiOperation({
    summary: 'Get friends list',
    description: 'Returns a paginated list of friends for the current user.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Friends list returned successfully',
  })
  @RoleGuard(RoleUser.USER)
  async getFriends(
    @AuthUser() user: JwtPayloadDto,
    @Query() filter: FriendshipFilterDto,
  ) {
    return this.friendshipService.getFriends(user.id, filter);
  }

  @Get('requests/pending')
  @ApiOperation({
    summary: 'Get pending requests',
    description:
      'Returns a list of pending friend requests for the current user.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Pending requests returned successfully',
  })
  @RoleGuard(RoleUser.USER)
  async getPendingRequests(@AuthUser() user: JwtPayloadDto) {
    return this.friendshipService.getPendingRequests(user.id);
  }

  @Get('check')
  @ApiOperation({
    summary: 'Check friendship status',
    description: 'Checks if the current user is friends with the target user.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Friendship status checked successfully',
  })
  @RoleGuard(RoleUser.USER)
  async checkFriendship(
    @AuthUser() user: JwtPayloadDto,
    @Query('targetUserId') targetUserId: string,
  ) {
    return this.friendshipService.checkFriendship(user.id, +targetUserId);
  }

  @Post('request/send')
  @ApiOperation({
    summary: 'Send friend request',
    description: 'Sends a friend request to another user.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Friend request sent successfully',
  })
  @RoleGuard(RoleUser.USER)
  async sendRequest(
    @AuthUser() user: JwtPayloadDto,
    @Body() dto: SendFriendRequestDto,
  ) {
    return this.friendshipService.sendFriendRequest(user.id, dto);
  }

  @Post('request/process')
  @ApiOperation({
    summary: 'Process friend request',
    description: 'Accepts or rejects a received friend request.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Friend request processed successfully',
  })
  @RoleGuard(RoleUser.USER)
  async processRequest(
    @AuthUser() user: JwtPayloadDto,
    @Body() dto: ProcessFriendRequestDto,
  ) {
    return this.friendshipService.processFriendRequest(user.id, dto);
  }

  @Post('block/:friendId')
  @ApiOperation({
    summary: 'Block user',
    description:
      'Blocks a user, preventing them from sending messages or friend requests.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User blocked successfully',
  })
  @RoleGuard(RoleUser.USER)
  async blockUser(
    @AuthUser() user: JwtPayloadDto,
    @Param('friendId') friendId: number,
  ) {
    return this.friendshipService.blockUser(user.id, +friendId);
  }

  @Post('unblock/:friendId')
  @ApiOperation({
    summary: 'Unblock user',
    description: 'Unblocks a user that was previously blocked.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User unblocked successfully',
  })
  @RoleGuard(RoleUser.USER)
  async unblockUser(
    @AuthUser() user: JwtPayloadDto,
    @Param('friendId') friendId: number,
  ) {
    return this.friendshipService.unblockUser(user.id, +friendId);
  }
}
