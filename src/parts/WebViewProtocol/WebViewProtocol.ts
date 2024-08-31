import * as HttpMethod from '../HttpMethod/HttpMethod.ts'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.ts'

export const getResponse = (method: string, url: string) => {
  // TODO allow head requests
  if (method !== HttpMethod.Get) {
    return {
      body: 'Method not allowed',
      init: {
        status: HttpStatusCode.MethodNotAllowed,
        headers: {
          'Cross-Origin-Resource-Policy': 'cross-origin',
          'Cross-Origin-Embedder-Policy': 'require-corp',
        },
      },
    }
  }
  return {
    body: 'test 123',
    init: {
      status: HttpStatusCode.Ok,
      headers: {
        'Cross-Origin-Resource-Policy': 'cross-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp',
      },
    },
  }
}
