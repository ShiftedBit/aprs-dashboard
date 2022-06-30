import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection, OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from "@nestjs/websockets";
import {Logger} from "@nestjs/common";
import {AprsService} from "../aprs-service/aprs.service";
import {Server, Socket} from "socket.io";

interface userListeners {
  [key: string]: AprsService
}

@WebSocketGateway({ cors: true })
export class AprsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  users: userListeners = {};

  @WebSocketServer() server;

  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string): void {
      this.server.emit('message', message);
      Logger.log(message);
  }

  @SubscribeMessage('initAprsGateway')
  handleInitAprsGateway(@MessageBody() message: { filter: string }, @ConnectedSocket() client: Socket): void {
    this.users[client.id] = new AprsService(client.id);
    this.users[client.id].stream.subscribe((packet) => {
      client.emit('packet', packet);
    })
    Logger.log('AprsGateway initialized for ' + client.id , 'AprsGateway');
    Logger.log('Current clients', Object.keys(this.users).length, 'AprsGateway');
  }

  afterInit(server: Server): void {
    Logger.log('Websocket started', server.path());
    this.server.emit('message', 'Start');
  }

  handleConnection(client: Socket): void {
    client.emit('message', 'Hi ' + client.id);
    Logger.log('Client connected: ' + client.id, 'AprsGateway');
  }

  handleDisconnect(client: Socket): void {
    this.users[client.id].stream.unsubscribe();
    this.users[client.id].disconnect();
    delete this.users[client.id];
    Logger.log('Client disconnected: ' + client.id, 'AprsGateway');
    Logger.log('Current clients: ' + Object.keys(this.users).length, 'AprsGateway');
  }
}
