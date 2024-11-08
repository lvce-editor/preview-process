import * as DefaultHeaders from '../DefaultHeaders/DefaultHeaders.ts'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.ts'

export const create = () => {
  return {
    body: `500 - Internal Server Error`,
    init: {
      status: HttpStatusCode.ServerError,
      headers: DefaultHeaders.defaultHeaders,
    },
  }
}
