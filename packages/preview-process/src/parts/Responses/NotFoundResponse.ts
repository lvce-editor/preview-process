import * as HttpHeader from '../HttpHeader/HttpHeader.ts'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.ts'

export class NotFoundResponse extends Response {
  constructor() {
    super('not found', {
      status: HttpStatusCode.NotFound,
      headers: {
        [HttpHeader.CrossOriginResourcePolicy]: 'same-origin',
      },
    })
  }
}
