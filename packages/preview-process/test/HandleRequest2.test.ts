import { expect, test } from '@jest/globals'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { Writable } from 'node:stream'
import * as HandleRequest2 from '../src/parts/HandleRequest2/HandleRequest2.ts'
import * as HttpStatusCode from '../src/parts/HttpStatusCode/HttpStatusCode.ts'
import * as SetInfo2 from '../src/parts/SetInfo2/SetInfo2.ts'

class MockServerResponse extends Writable {
  statusCode = 200
  headersSent = false
  #headers = new Map()
  chunks: Buffer[] = []

  constructor() {
    super()
    this.on('finish', () => {
      this.emit('end')
    })
  }

  getHeader(name: string): string {
    if (name === 'Content-Type') {
      return this.#headers.get('content-type')
    }
    return this.#headers.get(name)
  }

  setHeader(name: string, value: string): void {
    this.#headers.set(name, value)
  }

  _write(chunk: Buffer, encoding: string, callback: (error?: Error) => void): void {
    this.chunks.push(chunk)
    callback()
  }

  // @ts-ignore
  end(chunk?: Buffer): void {
    if (chunk) {
      this._write(Buffer.from(chunk), '', () => {})
    }
    super.end()
  }

  getContent(): string {
    return Buffer.concat(this.chunks).toString()
  }
}

const createMockResponse = () => {
  return new MockServerResponse() as unknown as ServerResponse
}

test('handleRequest2 - serves webview content at root path', async () => {
  const info = {
    webViewId: 'xyz',
    webViewRoot: '/test/root',
    contentSecurityPolicy: "default-src 'self'",
    iframeContent: '<h1>test content</h1>',
  }
  SetInfo2.setInfo2(info)

  const request = {
    url: '/xyz',
    method: 'GET',
    headers: {
      host: 'localhost:3000',
    },
  } as unknown as IncomingMessage
  const response = createMockResponse()
  await HandleRequest2.handleRequest2(request, response)

  const mockResponse = response as unknown as MockServerResponse
  expect(mockResponse.statusCode).toBe(HttpStatusCode.Ok)
  expect(mockResponse.getHeader('Content-Type')).toBe('text/html')
  expect(mockResponse.getContent()).toBe(info.iframeContent)
})

test.skip('handleRequest2 - serves static files from webview root', async () => {
  const info = {
    webViewId: 'xyz',
    webViewRoot: '/test/root',
    contentSecurityPolicy: "default-src 'self'",
    iframeContent: '<h1>test content</h1>',
  }
  SetInfo2.setInfo2(info)

  const request = {
    url: '/xyz/media/test.js',
    method: 'GET',
    headers: {
      host: 'localhost:3000',
    },
  } as unknown as IncomingMessage
  const response = createMockResponse()
  await HandleRequest2.handleRequest2(request, response)

  const mockResponse = response as unknown as MockServerResponse
  expect(mockResponse.statusCode).toBe(HttpStatusCode.Ok)
  expect(mockResponse.getHeader('Content-Type')).toBe('text/javascript')
})

test('handleRequest2 - returns 404 for unknown webview', async () => {
  const request = {
    url: '/unknown/test.js',
    method: 'GET',
    headers: {
      host: 'localhost:3000',
    },
  } as unknown as IncomingMessage
  const response = createMockResponse()
  await HandleRequest2.handleRequest2(request, response)

  const mockResponse = response as unknown as MockServerResponse
  expect(mockResponse.statusCode).toBe(HttpStatusCode.NotFound)
})
