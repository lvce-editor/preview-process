import { expect, test } from '@jest/globals'
import * as HttpStatusCode from '../src/parts/HttpStatusCode/HttpStatusCode.ts'
import { ContentResponse } from '../src/parts/Responses/ContentResponse.ts'

test('creates response with string content', async () => {
  const response = new ContentResponse('test content', 'text/plain')
  expect(response.status).toBe(HttpStatusCode.Ok)
  expect(await response.text()).toBe('test content')
  expect(response.headers.get('Content-Type')).toBe('text/plain')
  expect(response.headers.get('Cross-Origin-Resource-Policy')).toBe('same-origin')
})

test('creates response with buffer content', async () => {
  const response = new ContentResponse(Buffer.from('.test{color:red}'), 'text/css')
  expect(response.status).toBe(HttpStatusCode.Ok)
  expect(await response.text()).toBe('.test{color:red}')
  expect(response.headers.get('Content-Type')).toBe('text/css')
  expect(response.headers.get('Cross-Origin-Resource-Policy')).toBe('same-origin')
})

test('creates response with etag', async () => {
  const etag = '"123"'
  const response = new ContentResponse('test content', 'text/plain', etag)
  expect(response.status).toBe(HttpStatusCode.Ok)
  expect(await response.text()).toBe('test content')
  expect(response.headers.get('Content-Type')).toBe('text/plain')
  expect(response.headers.get('Cross-Origin-Resource-Policy')).toBe('same-origin')
  expect(response.headers.get('ETag')).toBe(etag)
})

test('creates response with buffer content and etag', async () => {
  const etag = '"456"'
  const response = new ContentResponse(Buffer.from('.test{color:red}'), 'text/css', etag)
  expect(response.status).toBe(HttpStatusCode.Ok)
  expect(await response.text()).toBe('.test{color:red}')
  expect(response.headers.get('Content-Type')).toBe('text/css')
  expect(response.headers.get('Cross-Origin-Resource-Policy')).toBe('same-origin')
  expect(response.headers.get('ETag')).toBe(etag)
})
