import * as request from 'request'
import { Get, Controller, Post, Header, Body } from '@nestjs/common';
import { KbankService } from 'services/kbank.service';
import { LoginContext } from 'types/login_context';
import { KbankAccountSummary } from 'types/kbank_account_res';

@Controller()
export class AppController {
  constructor(private readonly kbankService: KbankService) {}

  @Post("/kbank")
  root(@Body() loginContext: LoginContext): Promise<KbankAccountSummary> {
    loginContext.cookieJar = request.jar()
    return this.kbankService.execute(loginContext).then((res) => {
      return res
    })
  }
}
