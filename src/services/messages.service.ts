import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Message } from "../schemas/message.schema";
import { SocketService } from "./socket.service";
import { PersonalMessage } from "src/schemas/personal-message.schema";

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    @InjectModel(Message.name) private personalMessage: Model<PersonalMessage>,
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

  async createPersonal(
    content: string,
    sender: string,
    userId: string
  ): Promise<Message> {
    const createdMessage = new this.messageModel({ content, sender, userId });
    const newMessage = await createdMessage.save();

    const activeSocket = this.socketService.getActiveSocket();
    if (activeSocket) {
      activeSocket.to(userId).emit("newMessage", newMessage);
    }

    return newMessage;
  }

  async findAllByGroup(groupId: string): Promise<Message[]> {
    return this.messageModel.find({ groupId }).exec();
  }

  async findAllByUser(userId: string): Promise<PersonalMessage[]> {
    return this.personalMessage.find({ userId }).exec();
  }
}
