import { RoleUser } from '@constants/user.constant';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
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

  // ==================== GET INFO FRIENDSHIP (must be last — wildcard route) ====================
  @Get(':id/info')
  @ApiOperation({ summary: 'Get friendship info by id' })
  @RoleGuard(RoleUser.USER)
  async getInfoFriendship(@Param('id') id: string) {
    return this.friendshipService.getInfoFriendship(+id);
  }

  // ==================== GET FRIENDS ====================
  @Get()
  @ApiOperation({ summary: 'Get list of friends' })
  @RoleGuard(RoleUser.USER)
  async getFriends(
    @AuthUser() user: JwtPayloadDto,
    @Query() filter: FriendshipFilterDto,
  ) {
    return this.friendshipService.getFriends(user.id, filter);
  }

  // ==================== GET PENDING REQUESTS ====================
  @Get('requests/pending')
  @ApiOperation({ summary: 'Get list of pending friend requests' })
  @RoleGuard(RoleUser.USER)
  async getPendingRequests(@AuthUser() user: JwtPayloadDto) {
    return this.friendshipService.getPendingRequests(user.id);
  }

  // ==================== CHECK FRIENDSHIP ====================
  @Get('check')
  @ApiOperation({ summary: 'Check if two users are friends' })
  @RoleGuard(RoleUser.USER)
  async checkFriendship(
    @AuthUser() user: JwtPayloadDto,
    @Query('targetUserId') targetUserId: string,
  ) {
    return this.friendshipService.checkFriendship(user.id, +targetUserId);
  }

  // ==================== SEND FRIEND REQUEST ====================
  @Post('request/send')
  @ApiOperation({ summary: 'Send a friend request' })
  @RoleGuard(RoleUser.USER)
  async sendRequest(
    @AuthUser() user: JwtPayloadDto,
    @Body() dto: SendFriendRequestDto,
  ) {
    return this.friendshipService.sendFriendRequest(user.id, dto);
  }

  // ==================== PROCESS FRIEND REQUEST ====================
  @Post('request/process')
  @ApiOperation({ summary: 'Accept or reject a friend request' })
  @RoleGuard(RoleUser.USER)
  async processRequest(
    @AuthUser() user: JwtPayloadDto,
    @Body() dto: ProcessFriendRequestDto,
  ) {
    return this.friendshipService.processFriendRequest(user.id, dto);
  }
}
