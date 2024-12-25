import { expect, test } from '@jest/globals'
import * as HttpStatusCode from '../src/parts/HttpStatusCode/HttpStatusCode.ts'
import { ContentResponse } from '../src/parts/Responses/ContentResponse.ts'

test('ContentResponse - creates response with string content', async () => {
  const response = new ContentResponse('test content', 'text/plain')
  expect(response.status).toBe(HttpStatusCode.Ok)
  expect(await response.text()).toBe('test content')
  expect(response.headers.get('Content-Type')).toBe('text/plain')
  expect(response.headers.get('Cross-Origin-Resource-Policy')).toBe('same-origin')
})

test('ContentResponse - creates response with buffer content', async () => {
  const buffer = Buffer.from('.test{color:red}')
  const response = new ContentResponse(buffer, 'text/css')
  expect(response.status).toBe(HttpStatusCode.Ok)
  expect(await response.text()).toBe('.test{color:red}')
  expect(response.headers.get('Content-Type')).toBe('text/css')
  expect(response.headers.get('Cross-Origin-Resource-Policy')).toBe('same-origin')
})
