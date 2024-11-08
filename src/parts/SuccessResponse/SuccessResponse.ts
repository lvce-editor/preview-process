import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.ts'

export const create = (body: any, headers: any) => {
  return {
    body,
    init: {
      status: HttpStatusCode.Ok,
      headers,
    },
  }
}
