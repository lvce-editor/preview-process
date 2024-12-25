import * as HttpHeader from '../HttpHeader/HttpHeader.ts'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.ts'

export class ContentResponse extends Response {
  constructor(content: Buffer | string, contentType: string) {
    super(content, {
      status: HttpStatusCode.Ok,
      headers: {
        [HttpHeader.CrossOriginResourcePolicy]: 'same-origin',
        [HttpHeader.ContentType]: contentType,
      },
    })
  }
}
