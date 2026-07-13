import { expect, jest, test } from '@jest/globals'
import type { Info } from '../src/parts/Info.ts'
import * as GetIndexResponse from '../src/parts/GetIndexResponse/GetIndexResponse.ts'
import * as HttpHeader from '../src/parts/HttpHeader/HttpHeader.ts'

test('getIndexResponse', async () => {
  const info: Info = {
    contentSecurityPolicy: "default-src 'self'",
    iframeContent: '<h1>Hello World</h1>',
    webViewId: 'test',
    webViewRoot: '/test',
  }

  const response = await GetIndexResponse.getIndexResponse(info)

  expect(response).toEqual({
    body: '<h1>Hello World</h1>',
    init: {
      headers: {
        'Content-Security-Policy': "default-src 'self'",
        'Content-Type': 'text/html',
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Resource-Policy': 'same-origin',
      },
      status: 200,
    },
  })
})
