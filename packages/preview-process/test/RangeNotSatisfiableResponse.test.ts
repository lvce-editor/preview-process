import { expect, test } from '@jest/globals'
import * as HttpStatusCode from '../src/parts/HttpStatusCode/HttpStatusCode.ts'
import { RangeNotSatisfiableResponse } from '../src/parts/Responses/RangeNotSatisfiableResponse.ts'

test('RangeNotSatisfiableResponse - creates response with correct headers', () => {
  const response = new RangeNotSatisfiableResponse(1000)
  expect(response.status).toBe(HttpStatusCode.RangeNotSatisfiable)
  expect(response.headers.get('Content-Range')).toBe('bytes */1000')
  expect(response.headers.get('Cross-Origin-Resource-Policy')).toBe('same-origin')
})
