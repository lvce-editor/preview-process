import * as DefaultHeaders from '../DefaultHeaders/DefaultHeaders.ts'
import * as HttpHeader from '../HttpHeader/HttpHeader.ts'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.ts'

export const create = (): any => {
  return {
    body: '404 - Not Found',
    init: {
      status: HttpStatusCode.NotFound,
      headers: {
        ...DefaultHeaders.defaultHeaders,
        [HttpHeader.ContentType]: 'text/html',
      },
    },
  }
}
