import type { ReadStream } from 'node:fs'
import * as HttpHeader from '../HttpHeader/HttpHeader.ts'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.ts'

export class ContentResponse extends Response {
  constructor(content: Buffer | string | ReadStream, contentType: string, etag?: string) {
    const headers: Record<string, string> = {
      [HttpHeader.CrossOriginResourcePolicy]: 'same-origin',
      [HttpHeader.ContentType]: contentType,
    }

    if (etag) {
      headers[HttpHeader.Etag] = etag
    }

    super(content, {
      status: HttpStatusCode.Ok,
      headers,
    })
  }
}
