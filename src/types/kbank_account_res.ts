import { KbankAccount } from "./kbank_account";

export class KbankAccountSummary {
    constructor(
        public totalBalance: string,
        public bankAccounts: Array<KbankAccount>
    ){}
}