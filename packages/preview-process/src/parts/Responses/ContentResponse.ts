import type { ReadStream } from 'node:fs'
import * as HttpHeader from '../HttpHeader/HttpHeader.ts'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.ts'

export class ContentResponse extends Response {
  constructor(content: Buffer | string | ReadStream, contentType: string, etag?: string) {
    const headers: Record<string, string> = {
      [HttpHeader.ContentType]: contentType,
      [HttpHeader.CrossOriginResourcePolicy]: 'same-origin',
    }

    if (etag) {
      headers[HttpHeader.Etag] = etag
    }

    super(content, {
      headers,
      status: HttpStatusCode.Ok,
    })
  }
}
