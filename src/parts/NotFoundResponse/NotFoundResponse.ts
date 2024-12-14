import * as DefaultHeaders from '../DefaultHeaders/DefaultHeaders.ts'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.ts'

export const create = () => {
  return {
    body: '404 - Not Found',
    init: {
      status: HttpStatusCode.NotFound,
      headers: DefaultHeaders.defaultHeaders,
    },
  }
}

export const notFoundResponse = {
  absolutePath: '',
  status: HttpStatusCode.NotFound,
  headers: {},
}
