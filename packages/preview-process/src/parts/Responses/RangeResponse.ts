import * as HttpHeader from '../HttpHeader/HttpHeader.ts'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.ts'

export class RangeResponse extends Response {
  constructor(readStream: any, start: number, end: number, totalSize: number) {
    super(readStream, {
      status: HttpStatusCode.PartialContent,
      headers: {
        [HttpHeader.ContentRange]: `bytes ${start}-${end}/${totalSize}`,
        [HttpHeader.ContentLength]: `${end - start + 1}`,
        [HttpHeader.AcceptRanges]: 'bytes',
      },
    })
  }
}
