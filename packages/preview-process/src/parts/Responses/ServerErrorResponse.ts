import * as HttpHeader from '../HttpHeader/HttpHeader.ts'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.ts'

export class ServerErrorResponse extends Response {
  constructor() {
    super('Internal Server Error', {
      status: HttpStatusCode.ServerError,
      headers: {
        [HttpHeader.CrossOriginResourcePolicy]: 'same-origin',
      },
    })
  }
}
