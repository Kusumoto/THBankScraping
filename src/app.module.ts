import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { KbankService } from './services/kbank.service';
import { HttpOptionUtil } from './utils/http_options_util';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [ KbankService, HttpOptionUtil ]
})
export class AppModule {}
