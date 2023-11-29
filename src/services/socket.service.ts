import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';

@Injectable()
export class SocketService implements OnGatewayConnection, OnGatewayDisconnect {
  private socket: Socket;

  handleConnection(client: Socket) {
    this.socket = client;
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    this.socket = undefined;
    console.log('Client disconnected:', client.id);
  }

  getActiveSocket(): Socket | undefined {
    return this.socket;
  }
}
