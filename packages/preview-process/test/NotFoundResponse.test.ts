import { expect, test } from '@jest/globals'
import * as HttpStatusCode from '../src/parts/HttpStatusCode/HttpStatusCode.ts'
import * as NotFoundResponse from '../src/parts/NotFoundResponse/NotFoundResponse.ts'

test('create - returns correct not found response', () => {
  expect(NotFoundResponse.create()).toEqual({
    body: '404 - Not Found',
    init: {
      status: HttpStatusCode.NotFound,
      headers: {
        'Content-Type': 'text/html',
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Cross-Origin-Resource-Policy': 'cross-origin',
      },
    },
  })
})
