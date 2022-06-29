import {Logger} from "@nestjs/common";
import {ISSocket} from "js-aprs-is";
import {aprsParser} from "js-aprs-fap";
import {Subject} from "rxjs";

export class AprsService {

  CALLSIGN = 'NOCALL';
  PASSCODE = -1;
  APRSSERVER = 'rotate.aprs2.net';
  PORTNUMBER = 14580;
  FILTER = 'r/48.201754/16.326165/10';

  private connection: ISSocket;
  private parser = new aprsParser();

  public stream: Subject<string> = new Subject<string>();
  public room: string;

  constructor(room: string) {
    this.openSocket(room);
  }

  openSocket(room: string) {
    this.room = room;
    this.connection = new ISSocket(this.APRSSERVER, this.PORTNUMBER, this.CALLSIGN, this.PASSCODE, this.FILTER);
    this.connection.connect();
    Logger.log('APRS IS Connection opened for ' + this.room, 'AprsService');
    this.connection.on('connect', () => {
      this.connection.sendLine(this.connection.userLogin);
    });
    this.connection.on('packet', (data: string) => {
      if(data.charAt(0) != '#' && !data.startsWith('user')) {
        this.stream.next(this.parser.parseaprs(data).sourceCallsign);
        Logger.log('Packet sent to client ' + this.room, 'AprsService');
      }
    })
    this.connection.on('error', (error: Error) => {
      Logger.error(error);
    });
  }

  disconnect() {
    this.connection.disconnect();
    Logger.log('APRS IS Connection closed for ' + this.room, 'AprsService');
  }
}
