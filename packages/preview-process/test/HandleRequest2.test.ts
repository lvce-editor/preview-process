import type { Socket } from 'node:net'
import { expect, jest, test } from '@jest/globals'
import { IncomingMessage, ServerResponse } from 'node:http'
import { Writable } from 'node:stream'
import * as HttpStatusCode from '../src/parts/HttpStatusCode/HttpStatusCode.ts'
import * as SetInfo2 from '../src/parts/SetInfo2/SetInfo2.ts'

jest.unstable_mockModule('../src/parts/GetResponse/GetResponse.ts', () => {
  return {
    getResponse: jest.fn(),
  }
})

jest.unstable_mockModule('../src/parts/HandlePreviewInjected/HandlePreviewInjected.ts', () => {
  return {
    handlePreviewInjected: jest.fn(),
  }
})

const GetResponse = await import('../src/parts/GetResponse/GetResponse.ts')
const HandleRequest2 = await import('../src/parts/HandleRequest2/HandleRequest2.ts')
const HandlePreviewInjected = await import('../src/parts/HandlePreviewInjected/HandlePreviewInjected.ts')

class MockSocket extends Writable {
  chunks: Buffer[] = []

  _write(chunk: any, encoding: BufferEncoding, callback: (error?: Error | null) => void): void {
    this.chunks.push(Buffer.from(chunk))
    callback()
  }

  getContent(): string {
    return Buffer.concat(this.chunks).toString()
  }
}

const createRequest = (url: string): any => {
  const socket = new MockSocket()
  const request = new IncomingMessage(socket as unknown as Socket)
  request.url = url
  request.method = 'GET'
  request.headers = {
    host: 'localhost:3000',
  }
  return { request, socket }
}

const createResponse = (request: IncomingMessage, socket: MockSocket): ServerResponse => {
  const response = new ServerResponse(request)
  response.assignSocket(socket as unknown as Socket)
  return response
}

test.skip('handleRequest2 - serves preview-injected.js', async () => {
  const jsContent = 'console.log("preview-injected")'
  const mockResponse = new Response(jsContent, {
    status: HttpStatusCode.Ok,
    headers: {
      'Content-Type': 'text/javascript',
    },
  })
  jest.spyOn(HandlePreviewInjected, 'handlePreviewInjected').mockResolvedValue(mockResponse)

  const { request, socket } = createRequest('/js/preview-injected.js')
  const response = createResponse(request, socket)
  await HandleRequest2.handleRequest2(request, response)

  expect(response.statusCode).toBe(HttpStatusCode.Ok)
  expect(response.getHeader('Content-Type')).toBe('text/javascript')
  expect(socket.getContent()).toContain(jsContent)
})

test('handleRequest2 - serves webview content at root path', async () => {
  const info = {
    webViewId: 'xyz',
    webViewRoot: '/test/root',
    contentSecurityPolicy: "default-src 'self'",
    iframeContent: '<h1>test content</h1>',
  }
  SetInfo2.setInfo2(info)
  const mockResponse = new Response(info.iframeContent, {
    status: HttpStatusCode.Ok,
    headers: {
      'Content-Type': 'text/html',
    },
  })
  jest.spyOn(GetResponse, 'getResponse').mockResolvedValue(mockResponse)

  const { request, socket } = createRequest('/xyz')
  const response = createResponse(request, socket)
  await HandleRequest2.handleRequest2(request, response)

  expect(response.statusCode).toBe(HttpStatusCode.Ok)
  expect(response.getHeader('Content-Type')).toBe('text/html')
  expect(socket.getContent()).toContain(info.iframeContent)
})

test('handleRequest2 - serves static files from webview root', async () => {
  const info = {
    webViewId: 'xyz',
    webViewRoot: '/test/root',
    contentSecurityPolicy: "default-src 'self'",
    iframeContent: '<h1>test content</h1>',
  }
  SetInfo2.setInfo2(info)
  const jsContent = 'console.log("test")'
  const mockResponse = new Response(jsContent, {
    status: HttpStatusCode.Ok,
    headers: {
      'Content-Type': 'text/javascript',
      'Cross-Origin-Resource-Policy': 'same-origin',
    },
  })
  jest.spyOn(GetResponse, 'getResponse').mockResolvedValue(mockResponse)

  const { request, socket } = createRequest('/xyz/test.js')
  const response = createResponse(request, socket)
  await HandleRequest2.handleRequest2(request, response)

  expect(response.statusCode).toBe(HttpStatusCode.Ok)
  expect(response.getHeader('Content-Type')).toBe('text/javascript')
  expect(socket.getContent()).toContain(jsContent)
})

test('handleRequest2 - returns 404 for unknown webview', async () => {
  const { request, socket } = createRequest('/unknown/test.js')
  const response = createResponse(request, socket)
  await HandleRequest2.handleRequest2(request, response)

  expect(response.statusCode).toBe(HttpStatusCode.NotFound)
})
