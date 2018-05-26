import * as r from "request"

export class LoginContext {
    constructor(
        public username: string,
        public password: string,
        public cookieJar: r.CookieJar
    ){}
}