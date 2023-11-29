import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class FriendGateway {
  @WebSocketServer() server: Server;

  sendFriendRequestNotification(userId: string, senderId: string) {
    console.log("Friend Notif sent!")
    this.server.to(userId).emit('friendRequest', {
      message: 'You have a new friend request.',
      senderId: senderId,
    });
  }

  handleFriendRequestAction(socket: Socket, data: { action: string, senderId: string }) {
    if (data.action === 'accept') {
      socket.to(data.senderId).emit('friendRequestAccepted', { recipientId: socket.id });
    } else if (data.action === 'decline') {
      socket.to(data.senderId).emit('friendRequestDeclined', { recipientId: socket.id });
    }
  }

  handleFriendRequest(socket: Socket, data: { recipientId: string, senderId: string }) {
    // Emit the incoming friend request to the recipient's socket room
    const { recipientId, senderId } = data;
    this.server.to(recipientId).emit('friendRequestReceived', {
      message: 'You have received a friend request.',
      senderId: senderId,
    });
  }
}
