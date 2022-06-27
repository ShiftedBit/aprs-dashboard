import {Injectable, Logger} from "@nestjs/common";
import {ISSocket} from "js-aprs-is";
import {aprsParser} from "js-aprs-fap";
import {Subject} from "rxjs";

@Injectable()
export class AprsService {

  CALLSIGN = 'NOCALL';
  PASSCODE = -1;
  APRSSERVER = 'rotate.aprs2.net';
  PORTNUMBER = 14580;
  FILTER = 'r/48.201754/16.326165/10';

  private connection: ISSocket;
  private parser = new aprsParser();
  public stream: Subject<string> = new Subject<string>();

  openSocket() {
    this.connection = new ISSocket(this.APRSSERVER, this.PORTNUMBER, this.CALLSIGN, this.PASSCODE, this.FILTER);
    this.connection.connect();
    this.connection.on('connect', () => {
      this.connection.sendLine(this.connection.userLogin);
    });
    this.connection.on('packet', (data: string) => {
      if(data.charAt(0) != '#' && !data.startsWith('user')) {
        this.stream.next(this.parser.parseaprs(data).sourceCallsign);
      }
    })
    this.connection.on('error', (error: Error) => {
      Logger.error(error);
    });
  }
}
