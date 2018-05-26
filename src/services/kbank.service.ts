import * as cheerio from 'cheerio'
import * as rp from 'request-promise-native'
import { Injectable } from '@nestjs/common';
import { KbankConstants } from '../types/constants';
import { LoginContext } from "../types/login_context";
import { HttpOptionUtil, IHttpOptionUtil } from '../utils/http_options_util';
import { KbankAccountSummary } from '../types/kbank_account_res';
import { KbankAccount } from '../types/kbank_account';

@Injectable()
export class KbankService {
    httpOptions: IHttpOptionUtil

    constructor(httpOptions: HttpOptionUtil) {
        this.httpOptions = httpOptions
    }

    public execute(loginContext: LoginContext): Promise<Array<KbankAccountSummary>> {
        let accountFactory: Array<KbankAccountSummary> = []
        return this.login(loginContext).then((r1) => {
            return this.redirectToWelcomeActionPage(loginContext)
        }).then((r2) => {
            return this.getAccountBalance(KbankConstants.ACCOUNT_PORTAL_PAGE, "bank_account",loginContext)
        }).then((r3) => {
            accountFactory = accountFactory.concat(r3)
            return this.getAccountBalance(KbankConstants.CREDIT_PORTAL_PAGE, "credit_card",loginContext)
        }).then((r4) => {
            accountFactory = accountFactory.concat(r4)
            return accountFactory
        })
    }

    private redirectToWelcomeActionPage(loginContext: LoginContext): Promise<any> {
        return rp(KbankConstants.WELCONE_ACTION_PAGE, this.httpOptions.Get(loginContext.cookieJar)).then((r1) => {
            let $ = cheerio.load(r1)
            let payload = {
                txtParam: $('[name=\'txtParam\']').val()
            }
            return rp($('form').attr('action'), this.httpOptions.Post(loginContext.cookieJar, payload))
        }).then((r2) => {
            return r2
        })
    }

    private getAccountBalance(url: string, accountType: string, loginContext: LoginContext): Promise<KbankAccountSummary> {
        let kbankResponseCollection: Array<KbankAccount> = []
        return rp(url, this.httpOptions.Get(loginContext.cookieJar)).then((r1) => {
            let $ = cheerio.load(r1)
            let accountDetail = $('td.inner_table_center').not('[colspan=2]').each((i, element) => {
                element.children.map((data) => {
                    kbankResponseCollection.push({
                        accountType: accountType,
                        bankAccount: data.data,
                        totalBalance: '',
                        totalUsedBalance: ''
                    })
                })
            })
            let accountDetailBalance = $('td.inner_table_right').each((i, element) => {
                element.children.map((data, i) => {
                    if (data.data.trim() === "") return
                    for (let p = 0; p < kbankResponseCollection.length; p++) {
                        if (kbankResponseCollection[p].totalBalance === '' && kbankResponseCollection[p].totalUsedBalance === '') {
                            kbankResponseCollection[p].totalBalance = data.data
                            break
                        } else if (kbankResponseCollection[p].totalBalance !== '' && kbankResponseCollection[p].totalUsedBalance === '') {
                            kbankResponseCollection[p].totalUsedBalance = data.data
                            break
                        } else if (kbankResponseCollection[p].totalBalance !== '' && kbankResponseCollection[p].totalUsedBalance !== '') {
                            continue
                        }
                    }
                })
            })
            let accountSummaryData = $('.bodycopy_normal').get(1).children[0].data.trim()
            let kbankResponseData: KbankAccountSummary = {
                totalBalance: accountSummaryData,
                bankAccounts: kbankResponseCollection
            }
            return kbankResponseData
        })
    }

    private login(loginContext: LoginContext): Promise<any> {
        return rp(KbankConstants.LOGIN_URL, this.httpOptions.Get(loginContext.cookieJar)).then((r1) => {
            let $ = cheerio.load(r1)
            let payload = {
                tokenId: $('#tokenId').val(),
                userName: loginContext.username,
                password: loginContext.password,
                cmd: 'authenticate',
                locale: 'th',
                custType: '',
                app: 0
            }
            return rp(KbankConstants.LOGIN_URL, this.httpOptions.Post(loginContext.cookieJar, payload))
        }).then((r2) => {
            return r2
        })
    }
}
