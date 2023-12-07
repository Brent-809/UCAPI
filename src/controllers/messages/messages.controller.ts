import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { MessagesService } from '../../services/messages.service';

@Controller('messages')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
  ) {}

  @Post(':groupId')
  async create(@Param('groupId') groupId: string, @Body() data: { content: string; sender: string }) {
    const { content, sender } = data;

    return await this.messagesService.create(content, sender, groupId);
  }

  @Post('user/:userId')
  async createPersonalMessage(@Param('userId') userId: string, @Body() data: { content: string; sender: string }) {
    const { content, sender } = data;

    return await this.messagesService.createPersonal(content, sender, userId);
  }

  @Get(':groupId')
  async findAll(@Param('groupId') groupId: string) {
    return this.messagesService.findAllByGroup(groupId);
  }

  @Get('user/:userId')
  async findAllPrivateMessages(@Param('userId') userId: string) {
    return this.messagesService.findAllByUser(userId);
  }
}
