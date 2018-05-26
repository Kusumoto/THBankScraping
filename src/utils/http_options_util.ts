import * as r from "request"
import { RequestPromiseOptions } from "request-promise-native";
import { Injectable } from "@nestjs/common";

export interface IHttpOptionUtil {
    Get(cookieObject: r.CookieJar): RequestPromiseOptions
    Post(cookieObject: r.CookieJar, formData?: any): any
}

@Injectable()
export class HttpOptionUtil implements IHttpOptionUtil {
    public Get(cookieObject: r.CookieJar): RequestPromiseOptions {
        return {
            method: 'Get',
            followAllRedirects: true,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13'
            },
            jar: cookieObject
        }
    }

    public Post(cookieObject: r.CookieJar, formData?: any): RequestPromiseOptions {
        return {
            method: 'Post',
            followAllRedirects: true,
            formData: formData,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13'
            },
            jar: cookieObject
        }
    }
}