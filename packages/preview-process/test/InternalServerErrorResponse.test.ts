import { expect, test } from '@jest/globals'
import * as HttpStatusCode from '../src/parts/HttpStatusCode/HttpStatusCode.ts'
import * as InternalServerErrorResponse from '../src/parts/InternalServerErrorResponse/InternalServerErrorResponse.ts'

test('create - returns correct internal server error response', () => {
  expect(InternalServerErrorResponse.create()).toEqual({
    body: '500 - Internal Server Error',
    init: {
      headers: {
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Cross-Origin-Resource-Policy': 'cross-origin',
      },
      status: HttpStatusCode.ServerError,
    },
  })
})
