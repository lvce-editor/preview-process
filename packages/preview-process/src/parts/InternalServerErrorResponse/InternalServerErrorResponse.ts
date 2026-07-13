import * as DefaultHeaders from '../DefaultHeaders/DefaultHeaders.ts'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.ts'

export const create = (): any => {
  return {
    body: `500 - Internal Server Error`,
    init: {
      headers: DefaultHeaders.defaultHeaders,
      status: HttpStatusCode.ServerError,
    },
  }
}
