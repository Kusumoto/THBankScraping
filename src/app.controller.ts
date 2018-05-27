import * as request from 'request'
import { Get, Controller, Post, Header, Body, HttpStatus } from '@nestjs/common';
import { KbankService } from 'services/kbank.service';
import { LoginContext } from 'types/login_context';
import { KbankAccountSummary } from 'types/kbank_account_res';
import { IBankingService } from 'services/ibanking.service';
import { BaseResponse } from 'types/response';
import { IBankingAccount } from 'types/ibanking_account';

@Controller()
export class AppController {
  constructor(
    private readonly kbankService: KbankService,
    private readonly iBankingService: IBankingService
  ) {}

  @Post("/kbank")
  kBank(@Body() loginContext: LoginContext): Promise<BaseResponse<Array<KbankAccountSummary>>> {
    loginContext.cookieJar = request.jar()
    return this.kbankService.execute(loginContext).then((res) => {
      let response: BaseResponse<Array<KbankAccountSummary>> = {
        status: HttpStatus.OK.toString(),
        data: res,
        error: ''
      }
      return response
    })
  }

  @Post("/ibanking")
  iBanking(@Body()  loginContext: LoginContext): Promise<BaseResponse<Array<IBankingAccount>>> {
    loginContext.cookieJar = request.jar()
    return this.iBankingService.execute(loginContext).then((res) => {
      let response: BaseResponse<Array<IBankingAccount>> = {
        status: HttpStatus.OK.toString(),
        data: res,
        error: ''
      }
      return response
    })
  }
}
