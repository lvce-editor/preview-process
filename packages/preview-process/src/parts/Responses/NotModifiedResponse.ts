import * as HttpHeader from '../HttpHeader/HttpHeader.ts'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.ts'

export class NotModifiedResponse extends Response {
  constructor(etag: string) {
    super(null, {
      status: HttpStatusCode.NotModified,
      headers: {
        [HttpHeader.CrossOriginResourcePolicy]: 'same-origin',
        [HttpHeader.Etag]: etag,
      },
    })
  }
}
