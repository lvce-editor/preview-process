import * as DefaultHeaders from '../DefaultHeaders/DefaultHeaders.ts'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.ts'

export const create = (): any => {
  return {
    body: '405 - Method not allowed',
    init: {
      status: HttpStatusCode.MethodNotAllowed,
      headers: DefaultHeaders.defaultHeaders,
    },
  }
}
