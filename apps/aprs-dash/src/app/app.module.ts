import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NxWelcomeComponent } from './nx-welcome.component';
import { HttpClientModule } from '@angular/common/http';
import {SocketIoConfig, SocketIoModule} from "ngx-socket-io";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

const config: SocketIoConfig = { url: 'http://localhost:3333', options: { autoConnect: false} };

@NgModule({
  declarations: [AppComponent, NxWelcomeComponent],
  imports: [CommonModule, BrowserModule, HttpClientModule, SocketIoModule.forRoot(config), FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
