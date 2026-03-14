import { RoleUser } from '@constants/user.constant';
import { ParticipantFilterDto } from '@modules/user/dto/participant.req.dto';
import { ParticipantResDto } from '@modules/user/dto/participant.res.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthUser, RoleGuard } from '@shared/decorators/guard.decorator';
import { JwtPayloadDto } from '@shared/dtos/jwt-payload.dto';
import { PageDto } from '@shared/dtos/page.dto';
import { ConversationService } from './conversation.service';
import {
  AddConversationMemberDto,
  ChangeOwnerDto,
  ConversationFilterDto,
  CreateConversationDto,
  MuteConversationDto,
  ProcessJoinGroupRequestDto,
  RemoveConversationMemberDto,
  UpdateConversationDto,
} from './dto/conversation.req.dto';
import { ConversationResDto } from './dto/conversation.res.dto';

@ApiTags('Conversation')
@ApiBearerAuth()
@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  // ==================== GET LIST ====================
  @Get()
  @ApiOperation({ summary: 'Get list of conversations' })
  async getList(
    @Query() filterDto: ConversationFilterDto,
  ): Promise<PageDto<ConversationResDto>> {
    return this.conversationService.getListOfConversation(filterDto);
  }

  @Get('user')
  @ApiOperation({ summary: 'Get list of conversations by user ID' })
  async getListByUserId(
    @AuthUser() user: JwtPayloadDto,
    @Query() filterDto: ConversationFilterDto,
  ): Promise<
    PageDto<{ conversation: ConversationResDto; unreadCount: number }>
  > {
    return this.conversationService.getConversationsByUserId(
      user.id,
      filterDto,
    );
  }

  @Get(':id/participants')
  @ApiOperation({ summary: 'Get list of participants in a conversation' })
  async getParticipants(
    @Param('id') id: string,
    @Query() filterDto: ParticipantFilterDto,
  ): Promise<PageDto<ParticipantResDto>> {
    return this.conversationService.getListOfParticipants(+id, filterDto);
  }

  // ==================== GET INFO ====================
  @Get(':id/info')
  @ApiOperation({
    summary: 'Get conversation by ID',
    description:
      'Returns conversation information for the specified conversation ID.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ConversationResDto,
    description: 'Conversation information returned successfully',
  })
  async getInfo(@Param('id') id: string): Promise<ConversationResDto> {
    return this.conversationService.getInfoConversation(+id);
  }

  // ==================== CREATE ====================
  @Post()
  @ApiOperation({
    summary: 'Create a new conversation',
    description: 'Create a new conversation with the provided details',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Conversation created successfully',
  })
  @RoleGuard(RoleUser.USER)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  async create(
    @AuthUser() user: JwtPayloadDto,
    @Body() payload: CreateConversationDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    console.log('file', file);
    return this.conversationService.createConversation(user.id, payload, file);
  }

  // ==================== EDIT ====================
  @Put('edit/:id')
  @ApiOperation({
    summary: 'Edit a conversation',
    description: 'Edit a conversation with the provided details',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Conversation edited successfully',
  })
  @RoleGuard(RoleUser.USER)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  async edit(
    @AuthUser() user: JwtPayloadDto,
    @Param('id') id: string,
    @Body() payload: UpdateConversationDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.conversationService.editConversation(
      user.id,
      +id,
      payload,
      file,
    );
  }

  // ==================== ARCHIVE ====================
  @Post('archive/:id')
  @ApiOperation({
    summary: 'Archive a conversation',
    description: 'Archive a conversation with the provided details',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Conversation archived successfully',
  })
  @RoleGuard(RoleUser.USER)
  async archive(@AuthUser() user: JwtPayloadDto, @Param('id') id: string) {
    return this.conversationService.archiveConversation(user.id, +id);
  }

  // ==================== UNARCHIVE ====================
  @Post('unarchive/:id')
  @ApiOperation({
    summary: 'Unarchive a conversation',
    description: 'Unarchive a conversation with the provided details',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Conversation unarchived successfully',
  })
  @RoleGuard(RoleUser.USER)
  async unarchive(@AuthUser() user: JwtPayloadDto, @Param('id') id: string) {
    return this.conversationService.unarchiveConversation(user.id, +id);
  }

  // ==================== MUTE ====================
  @Post('mute/:id')
  @ApiOperation({
    summary: 'Mute a conversation',
    description: 'Mute a conversation with the provided details',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Conversation muted successfully',
  })
  @RoleGuard(RoleUser.USER)
  async mute(
    @AuthUser() user: JwtPayloadDto,
    @Param('id') id: string,
    @Body() payload: MuteConversationDto,
  ) {
    return this.conversationService.muteConversation(user.id, +id, payload);
  }

  // ==================== UNMUTE ====================
  @Post('unmute/:id')
  @ApiOperation({
    summary: 'Unmute a conversation',
    description: 'Unmute a conversation with the provided details',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Conversation unmuted successfully',
  })
  @RoleGuard(RoleUser.USER)
  async unmute(@AuthUser() user: JwtPayloadDto, @Param('id') id: string) {
    return this.conversationService.unmuteConversation(user.id, +id);
  }

  // ==================== PIN ====================
  @Post('pin/:id')
  @ApiOperation({
    summary: 'Pin a conversation',
    description: 'Pin a conversation with the provided details',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Conversation pinned successfully',
  })
  @RoleGuard(RoleUser.USER)
  async pin(@AuthUser() user: JwtPayloadDto, @Param('id') id: string) {
    return this.conversationService.pinConversation(user.id, +id);
  }

  // ==================== UNPIN ====================
  @Post('unpin/:id')
  @ApiOperation({
    summary: 'Unpin a conversation',
    description: 'Unpin a conversation with the provided details',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Conversation unpinned successfully',
  })
  @RoleGuard(RoleUser.USER)
  async unpin(@AuthUser() user: JwtPayloadDto, @Param('id') id: string) {
    return this.conversationService.unpinConversation(user.id, +id);
  }

  // ==================== BLOCK ====================
  @Post('block/:id')
  @ApiOperation({
    summary: 'Block a direct conversation',
    description: 'Block a direct conversation with the provided details',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Conversation blocked successfully',
  })
  @RoleGuard(RoleUser.USER)
  async block(@AuthUser() user: JwtPayloadDto, @Param('id') id: string) {
    return this.conversationService.blockConversation(user.id, +id);
  }

  // ==================== UNBLOCK ====================
  @Post('unblock/:id')
  @ApiOperation({
    summary: 'Unblock a direct conversation',
    description: 'Unblock a direct conversation with the provided details',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Conversation unblocked successfully',
  })
  @RoleGuard(RoleUser.USER)
  async unblock(@AuthUser() user: JwtPayloadDto, @Param('id') id: string) {
    return this.conversationService.unblockConversation(user.id, +id);
  }

  // ==================== ADD MEMBER ====================
  @Post(':id/members')
  @ApiOperation({
    summary: 'Add members to group',
    description: 'Add members to group with the provided details',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Members added successfully',
  })
  @RoleGuard(RoleUser.USER)
  async addMember(
    @AuthUser() user: JwtPayloadDto,
    @Param('id') id: string,
    @Body() payload: AddConversationMemberDto,
  ) {
    return this.conversationService.addMemberToGroup(user.id, +id, payload);
  }

  // ==================== KICK MEMBER ====================
  @Delete(':id/members')
  @ApiOperation({
    summary: 'Kick members from group',
    description: 'Kick members from group with the provided details',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Members kicked successfully',
  })
  @RoleGuard(RoleUser.USER)
  async kickMember(
    @AuthUser() user: JwtPayloadDto,
    @Param('id') id: string,
    @Body() payload: RemoveConversationMemberDto,
  ) {
    return this.conversationService.kickMemberFromGroup(user.id, +id, payload);
  }

  // ==================== LEAVE GROUP ====================
  @Post(':id/leave')
  @ApiOperation({
    summary: 'Leave a group',
    description: 'Leave a group with the provided details',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Group left successfully',
  })
  @RoleGuard(RoleUser.USER)
  async leave(@AuthUser() user: JwtPayloadDto, @Param('id') id: string) {
    return this.conversationService.leaveGroup(user.id, +id);
  }

  // ==================== CHANGE OWNER ====================
  @Post(':id/change-owner')
  @ApiOperation({
    summary: 'Change group owner',
    description: 'Change group owner with the provided details',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Group owner changed successfully',
  })
  @RoleGuard(RoleUser.USER)
  async changeOwner(
    @AuthUser() user: JwtPayloadDto,
    @Param('id') id: string,
    @Body() payload: ChangeOwnerDto,
  ) {
    return this.conversationService.changeOwnerOfGroup(user.id, +id, payload);
  }
  // ==================== REQUEST TO JOIN GROUP ====================
  @Post(':id/join-request')
  @ApiOperation({
    summary: 'Request to join a group',
    description:
      'Send a request to join a group conversation. The group owner will be notified.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Join request sent successfully',
  })
  @RoleGuard(RoleUser.USER)
  async requestToJoinGroup(
    @AuthUser() user: JwtPayloadDto,
    @Param('id') id: string,
  ) {
    return this.conversationService.requestToJoinGroup(user.id, +id);
  }

  // ==================== PROCESS JOIN GROUP REQUEST ====================
  @Post(':id/join-request/:requestKey/process')
  @ApiOperation({
    summary: 'Process a join group request',
    description:
      'Approve or reject a pending join group request. Only the group owner can process requests.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Join request processed successfully',
  })
  @RoleGuard(RoleUser.USER)
  async processJoinGroupRequest(
    @AuthUser() user: JwtPayloadDto,
    @Param('id') id: string,
    @Param('requestKey') requestKey: string,
    @Body() payload: ProcessJoinGroupRequestDto,
  ) {
    return this.conversationService.processJoinGroupRequest(
      user.id,
      requestKey,
      payload,
    );
  }
}
