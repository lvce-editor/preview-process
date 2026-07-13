import * as HttpHeader from '../HttpHeader/HttpHeader.ts'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.ts'

export class MethodNotAllowedResponse extends Response {
  constructor() {
    super('405 - Method Not Allowed', {
      headers: {
        [HttpHeader.CrossOriginResourcePolicy]: 'same-origin',
      },
      status: HttpStatusCode.MethodNotAllowed,
    })
  }
}
