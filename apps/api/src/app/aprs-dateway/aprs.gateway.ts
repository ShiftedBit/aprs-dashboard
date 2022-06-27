import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from "@nestjs/websockets";
import {Logger} from "@nestjs/common";
import {AprsService} from "../aprs-service/aprs.service";

@WebSocketGateway({ cors: true })
export class AprsGateway implements OnGatewayInit, OnGatewayConnection {

  constructor(private aprsService: AprsService) {}

  @WebSocketServer() server;

  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string): void {
      this.server.emit('message', message);
      Logger.log(message);
  }

  afterInit(server: any): any {
    Logger.log('Websocket started', 'WebSocketsController');
    this.server.emit('message', 'Start');

    this.aprsService.openSocket();
    this.aprsService.stream.subscribe(value => this.server.emit('message', value));
  }

  handleConnection(client: any): any {
    Logger.log('Client connected', client.id);
  }
}
