import * as HttpHeader from '../HttpHeader/HttpHeader.ts'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.ts'

export class RangeNotSatisfiableResponse extends Response {
  constructor(totalSize: number) {
    super(null, {
      headers: {
        [HttpHeader.ContentRange]: `bytes */${totalSize}`,
        [HttpHeader.CrossOriginResourcePolicy]: 'same-origin',
      },
      status: HttpStatusCode.RangeNotSatisfiable,
    })
  }
}
