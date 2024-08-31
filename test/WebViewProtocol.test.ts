import { expect, test } from '@jest/globals'
import * as HttpMethod from '../src/parts/HttpMethod/HttpMethod.ts'
import * as HttpStatusCode from '../src/parts/HttpStatusCode/HttpStatusCode.ts'
import * as WebViewProtocol from '../src/parts/WebViewProtocol/WebViewProtocol.ts'

test('method not allowed - post', async () => {
  const method = HttpMethod.Post
  const url = '/test/media'
  expect(await WebViewProtocol.getResponse(method, url)).toEqual({
    body: 'Method not allowed',
    init: {
      status: HttpStatusCode.MethodNotAllowed,
      headers: {
        'Cross-Origin-Resource-Policy': 'cross-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp',
      },
    },
  })
})

test('get', async () => {
  const method = HttpMethod.Get
  const url = '/test/media'
  expect(await WebViewProtocol.getResponse(method, url)).toEqual({
    body: 'test 123',
    init: {
      status: HttpStatusCode.Ok,
      headers: {
        'Cross-Origin-Resource-Policy': 'cross-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp',
      },
    },
  })
})
