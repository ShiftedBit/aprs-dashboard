import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Message } from '@aprs-dashboard/api-interfaces';
import {Socket} from "ngx-socket-io";
import {map} from "rxjs";

@Component({
  selector: 'aprs-dashboard-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  hello$ = this.http.get<Message>('/api/hello');
  constructor(private http: HttpClient, public socket: Socket) {
    this.socket.emit('message', 'Hi');
    this.getMessage().subscribe(value => {
      console.log(value);
    })
  }

  getMessage() {
    return this.socket.fromEvent('message');
  }
}
