import { expect, jest, test } from '@jest/globals'
import * as HandleIndexHtml from '../src/parts/HandleIndexHtml/HandleIndexHtml.ts'
import * as HttpStatusCode from '../src/parts/HttpStatusCode/HttpStatusCode.ts'
import * as HttpHeader from '../src/parts/HttpHeader/HttpHeader.ts'

const defaultOptions = {
  webViewRoot: '/test',
  contentSecurityPolicy: "default-src 'self'",
  iframeContent: '<h1>Test Content</h1>',
  stream: false,
  etag: true,
  remotePathPrefix: '/remote',
}

test('handleIndexHtml - returns content with etag and security headers', async () => {
  const request = {
    method: 'GET',
    path: '/index.html',
    headers: {},
  }

  const response = await HandleIndexHtml.handleIndexHtml(request, defaultOptions)
  expect(response.status).toBe(HttpStatusCode.Ok)
  expect(await response.text()).toBe('<h1>Test Content</h1>')
  expect(response.headers.get('ETag')).toMatch(/^W\/"[a-f0-9]+"$/)
  expect(response.headers.get('Cross-Origin-Resource-Policy')).toBe('cross-origin')
  expect(response.headers.get('Cross-Origin-Embedder-Policy')).toBe('require-corp')
  expect(response.headers.get('Content-Security-Policy')).toBe("default-src 'self'")
})

test('handleIndexHtml - returns 304 with security headers when etag matches', async () => {
  const request1 = {
    method: 'GET',
    path: '/index.html',
    headers: {},
  }
  const response1 = await HandleIndexHtml.handleIndexHtml(request1, defaultOptions)
  const etag = response1.headers.get('ETag')

  const request2 = {
    method: 'GET',
    path: '/index.html',
    headers: {
      'if-none-match': etag,
    },
  }
  const response2 = await HandleIndexHtml.handleIndexHtml(request2, defaultOptions)
  expect(response2.status).toBe(HttpStatusCode.NotModified)
  expect(response2.headers.get('ETag')).toBe(etag)
  expect(response2.headers.get('Cross-Origin-Resource-Policy')).toBe('same-origin')
})

test('handleIndexHtml - returns content without etag when etag option is false', async () => {
  const request = {
    method: 'GET',
    path: '/index.html',
    headers: {},
  }

  const options = { ...defaultOptions, etag: false }
  const response = await HandleIndexHtml.handleIndexHtml(request, options)
  expect(response.status).toBe(HttpStatusCode.Ok)
  expect(await response.text()).toBe('<h1>Test Content</h1>')
  expect(response.headers.get('ETag')).toBeNull()
  expect(response.headers.get('Cross-Origin-Resource-Policy')).toBe('cross-origin')
  expect(response.headers.get('Cross-Origin-Embedder-Policy')).toBe('require-corp')
})

test('handleIndexHtml - returns 500 when no iframe content', async () => {
  const request = {
    method: 'GET',
    path: '/index.html',
    headers: {},
  }

  const options = { ...defaultOptions, iframeContent: '' }
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
  const response = await HandleIndexHtml.handleIndexHtml(request, options)

  expect(response.status).toBe(HttpStatusCode.ServerError)
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith('[preview-server] Error: iframe content is required')
  spy.mockRestore()
})

test('handleIndexHtml - generates different etags for different content', async () => {
  const request = {
    method: 'GET',
    path: '/index.html',
    headers: {},
  }

  const options1 = { ...defaultOptions, iframeContent: '<h1>Content 1</h1>' }
  const response1 = await HandleIndexHtml.handleIndexHtml(request, options1)
  const etag1 = response1.headers.get('ETag')

  const options2 = { ...defaultOptions, iframeContent: '<h1>Content 2</h1>' }
  const response2 = await HandleIndexHtml.handleIndexHtml(request, options2)
  const etag2 = response2.headers.get('ETag')

  expect(etag1).not.toBe(etag2)
  expect(response1.headers.get('Cross-Origin-Resource-Policy')).toBe('cross-origin')
  expect(response2.headers.get('Cross-Origin-Resource-Policy')).toBe('cross-origin')
})
