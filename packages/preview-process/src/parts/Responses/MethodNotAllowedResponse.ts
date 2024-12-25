import * as HttpHeader from '../HttpHeader/HttpHeader.ts'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.ts'

export class MethodNotAllowedResponse extends Response {
  constructor() {
    super('Method Not Allowed', {
      status: HttpStatusCode.MethodNotAllowed,
      headers: {
        [HttpHeader.CrossOriginResourcePolicy]: 'same-origin',
      },
    })
  }
}