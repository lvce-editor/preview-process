import * as HttpHeader from '../HttpHeader/HttpHeader.ts'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.ts'

export class ServerErrorResponse extends Response {
  constructor(error: Error) {
    console.error(`[preview-server] ${error}`)
    super('Internal Server Error', {
      status: HttpStatusCode.ServerError,
      headers: {
        [HttpHeader.CrossOriginResourcePolicy]: 'same-origin',
      },
    })
  }
}
