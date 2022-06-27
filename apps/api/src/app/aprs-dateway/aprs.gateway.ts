import {
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

@WebSocketGateway({ cors: true })
export class AprsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  constructor(private aprsService: AprsService) {}

  @WebSocketServer() server;

  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string): void {
      this.server.emit('message', message);
      Logger.log(message);
  }

  afterInit(server: Server): void {
    Logger.log('Websocket started', server.path());
    this.server.emit('message', 'Start');

    this.aprsService.openSocket();
    this.aprsService.stream.subscribe(value => this.server.emit('message', value));
  }

  handleConnection(client: Socket): void {
    client.emit('message', 'Hi ' + client.id);
    Logger.log('Client connected', client);
  }

  handleDisconnect(client: Socket): void {
    Logger.log('Client disconnected', client.id);
  }
}
