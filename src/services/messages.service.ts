import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Message } from "../schemas/message.schema";
import { SocketService } from "./socket.service";

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    private socketService: SocketService
  ) {}

  async create(
    content: string,
    sender: string,
    groupId: string
  ): Promise<Message> {
    const createdMessage = new this.messageModel({ content, sender, groupId });
    const newMessage = await createdMessage.save();

    const activeSocket = this.socketService.getActiveSocket();
    if (activeSocket) {
      activeSocket.to(groupId).emit("newMessage", newMessage);
    }

    return newMessage;
  }

  async findAllByGroup(groupId: string): Promise<Message[]> {
    return this.messageModel.find({ groupId }).exec();
  }
}
