import * as HttpHeader from '../HttpHeader/HttpHeader.ts'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.ts'

export class BadRequestResponse extends Response {
  constructor(message: string = 'Bad Request') {
    super(message, {
      status: HttpStatusCode.BadRequest,
      headers: {
        [HttpHeader.CrossOriginResourcePolicy]: 'same-origin',
      },
    })
  }
}
