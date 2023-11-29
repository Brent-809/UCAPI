import { WebSocketGateway, WebSocketServer, SubscribeMessage } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { MessagesService } from "../../services/messages.service";
import { SocketService } from "../../services/socket.service";

@WebSocketGateway()
export class MessagesGateway {
  constructor(
    private messagesService: MessagesService,
    private socketService: SocketService
  ) {}

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    this.socketService.handleConnection(client);
    console.log("Client connected:", client.id);
  }

  handleDisconnect(client: Socket) {
    this.socketService.handleDisconnect(client);
    console.log("Client disconnected:", client.id);
  }

  @SubscribeMessage("newMessage")
  async handleMessage(
    client: Socket,
    data: { content: string; sender: string; groupId: string }
  ) {
    const { content, sender, groupId } = data;
    const newMessage = await this.messagesService.create(
      content,
      sender,
      groupId
    );
    
    const activeSocket = this.socketService.getActiveSocket();
    if (activeSocket) {
      activeSocket.to(groupId).emit("newMessage", newMessage);
    }
  }

  @SubscribeMessage("joinGroup")
  async handleJoinGroup(client: Socket, data: { groupId: string }) {
    const { groupId } = data;
    client.join(groupId);
    const messages = await this.messagesService.findAllByGroup(groupId);
    client.emit("allMessages", messages);
  }
}
