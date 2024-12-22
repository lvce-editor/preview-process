import { expect, test } from '@jest/globals'
import * as NotFoundResponse from '../src/parts/NotFoundResponse/NotFoundResponse.ts'
import * as HttpStatusCode from '../src/parts/HttpStatusCode/HttpStatusCode.ts'
import * as DefaultHeaders from '../src/parts/DefaultHeaders/DefaultHeaders.ts'

test('create - returns correct not found response', () => {
  expect(NotFoundResponse.create()).toEqual({
    body: '404 - Not Found',
    init: {
      status: HttpStatusCode.NotFound,
      headers: DefaultHeaders.defaultHeaders,
    },
  })
})
