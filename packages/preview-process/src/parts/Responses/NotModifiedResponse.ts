import * as HttpHeader from '../HttpHeader/HttpHeader.ts'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.ts'

export class NotModifiedResponse extends Response {
  constructor(etag: string, extraHeaders: Record<string, string> = {}) {
    super(null, {
      headers: {
        [HttpHeader.CrossOriginResourcePolicy]: 'same-origin',
        [HttpHeader.Etag]: etag,
        ...extraHeaders,
      },
      status: HttpStatusCode.NotModified,
    })
  }
}
