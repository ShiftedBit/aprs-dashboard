import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import {AprsGateway} from "./aprs-dateway/aprs.gateway";

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, AprsGateway],
})
export class AppModule {}
