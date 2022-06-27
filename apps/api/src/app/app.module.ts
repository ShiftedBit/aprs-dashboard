import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import {AprsGateway} from "./aprs-dateway/aprs.gateway";
import {AprsService} from "./aprs-service/aprs.service";

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, AprsGateway, AprsService],
})
export class AppModule {}
