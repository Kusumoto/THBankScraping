import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { KbankService } from './services/kbank.service';
import { HttpOptionUtil } from './utils/http_options_util';
import { IBankingService } from './services/ibanking.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [ KbankService, HttpOptionUtil, IBankingService ]
})
export class AppModule {}
