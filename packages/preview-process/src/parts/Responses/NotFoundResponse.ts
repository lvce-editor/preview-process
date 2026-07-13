import * as HttpHeader from '../HttpHeader/HttpHeader.ts'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.ts'

export class NotFoundResponse extends Response {
  constructor() {
    super('not found', {
      headers: {
        [HttpHeader.CrossOriginResourcePolicy]: 'same-origin',
      },
      status: HttpStatusCode.NotFound,
    })
  }
}
