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
    const newMessage = await this.messagesService.create(content, sender, groupId);

    return newMessage;
  }

  @Get(':groupId')
  async findAll(@Param('groupId') groupId: string) {
    return this.messagesService.findAllByGroup(groupId);
  }
}
