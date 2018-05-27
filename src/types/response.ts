export class BaseResponse<T> {
    constructor(
        public status: string,
        public data: T,
        public error: string
    ){}
}