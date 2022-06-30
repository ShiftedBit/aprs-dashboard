import { Component } from '@angular/core';
import {Socket} from "ngx-socket-io";

@Component({
  selector: 'aprs-dashboard-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  messages: string[] = [];
  filter: string | undefined = "r/48.201754/16.326165/10";

  constructor(public socket: Socket) {
    this.socket.emit('message', 'Hi');
    this.getMessage().subscribe(value => {
      this.messages.push(value as string);
    })
  }

  getMessage() {
    return this.socket.fromEvent('packet');
  }

  initAprsConnection() {
    this.socket.connect();
    this.socket.on('connect_error', () => {
      console.log('error');
    })
    this.socket.emit('initAprsGateway', { filter: this.filter });
  }

  disconnect() {
    this.socket.disconnect();
  }
}
