import * as cheerio from 'cheerio'
import * as rp from 'request-promise-native'
import { Injectable } from "@nestjs/common";
import { IHttpOptionUtil, HttpOptionUtil } from "../utils/http_options_util";
import { LoginContext } from "../types/login_context";
import { IBankingConstants } from "../types/constants";
import { IBankingAccount } from '../types/ibanking_account';

@Injectable()
export class IBankingService {
    httpOptions: IHttpOptionUtil

    constructor(httpOptions: HttpOptionUtil) {
        this.httpOptions = httpOptions
    }

    public execute(loginContext: LoginContext): Promise<Array<IBankingAccount>> {
        return this.login(loginContext).then((r1) => {
            return this.getAccountBalance(IBankingConstants.ACCOUNT_PORTAL_PAGE, loginContext)
        }).then((r2) => {
            return r2
        })
    }

    private getAccountBalance(url: string, loginContext: LoginContext): Promise<Array<IBankingAccount>> {
        let iBankingAccounts: Array<IBankingAccount> = []
        return rp(IBankingConstants.ACCOUNT_PORTAL_PAGE, this.httpOptions.Get(loginContext.cookieJar)).then((r1) => {
            let $ = cheerio.load(r1)
            let accountDetail = $('.tableRowEllipsis.navigate.select')
                .find('.tablecellEllipsis.listitem.norightpadding.left')
                .find('.tablecellEllipsis.left')
                .map((i, element) => {
                    let iBankingAccount: IBankingAccount = {
                        bankAccount: '',
                        bankAccountType: '',
                        totalBalance: ''
                    }
                    element.children.map((element2, p) => {
                        if (element2.children !== undefined) {
                            if (iBankingAccount.bankAccountType === '') {
                                iBankingAccount.bankAccountType = element2.children[0].data
                            } else {
                                iBankingAccount.bankAccount = element2.children[0].data
                            }
                        }
                    })
                    iBankingAccounts.push(iBankingAccount)
                })
            let accountDetailBalance = $('.tableRowEllipsis.navigate.select')
                .find('.tablecellEllipsis.listitem.norightpadding.left')
                .find('.tablecellEllipsis.right')
                .map((i, element) => {
                    element.children.map((element2, p) => {
                        if (element2.children !== undefined) {
                            iBankingAccounts[i].totalBalance = element2.children[0].data
                        }
                    })
                })
            return iBankingAccounts
        })
    }

    private login(loginContext: LoginContext): Promise<any> {
        return rp(IBankingConstants.LOGIN_URL, this.httpOptions.Get(loginContext.cookieJar)).then((r1) => {
            let $ = cheerio.load(r1)
            let payload = {
                __VIEWSTATE: $('#__VIEWSTATE').val(),
                __VIEWSTATEGENERATOR: $('#__VIEWSTATEGENERATOR').val(),
                ctl00$pnlContent$txtUserName: loginContext.username,
                ctl00$pnlContent$txtPassword: loginContext.password,
                ctl00$pnlContent$lnkSubmit: 'Log On',
                ctl00$pnlContent$hdfConfirm: 'This will take you to FAQs page on Bualuang mBanking website.  Are you sure you want to proceed?',
                ctl00$pnlContent$hdfURL: 'https://mbanking.bangkokbank.com/FAQ/FAQ_EN.html'
            }
            return rp(IBankingConstants.LOGIN_URL, this.httpOptions.Post(loginContext.cookieJar, payload))
        }).then((r2) => {
            return r2
        })
    }
}