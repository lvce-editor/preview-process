import { expect, test } from '@jest/globals'
import { Writable } from 'node:stream'
import * as HttpStatusCode from '../src/parts/HttpStatusCode/HttpStatusCode.ts'
import { RangeResponse } from '../src/parts/Responses/RangeResponse.ts'

test('RangeResponse - creates response with correct headers', async () => {
  const mockStream = new Writable({
    write(chunk, encoding, callback): void {
      callback()
    },
  })

  const response = new RangeResponse(mockStream as any, 0, 100, 1000)
  expect(response.status).toBe(HttpStatusCode.PartialContent)
  expect(response.headers.get('Content-Range')).toBe('bytes 0-100/1000')
  expect(response.headers.get('Content-Length')).toBe('101')
  expect(response.headers.get('Accept-Ranges')).toBe('bytes')
})
