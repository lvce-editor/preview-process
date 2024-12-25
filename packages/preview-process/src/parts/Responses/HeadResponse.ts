import * as HttpHeader from '../HttpHeader/HttpHeader.ts'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.ts'

export class HeadResponse extends Response {
  constructor(status: number, headers: Headers) {
    super(null, {
      status,
      headers,
    })
  }
}
