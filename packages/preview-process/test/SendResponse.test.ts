import type { ServerResponse } from 'node:http'
import { expect, jest, test } from '@jest/globals'
import { Readable, Writable } from 'node:stream'
import * as HttpStatusCode from '../src/parts/HttpStatusCode/HttpStatusCode.ts'
import * as SendResponse from '../src/parts/SendResponse/SendResponse.ts'

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

const createMockResponse = (): ServerResponse => {
  return new MockServerResponse() as unknown as ServerResponse
}

const createMockReadableStream = (content: string): Readable =>
  new Readable({
    read(): void {
      this.push(content)
      this.push(null)
    },
  })

test('sendResponse - handles successful response with body', async () => {
  const mockResponse = createMockResponse()
  const mockStream = createMockReadableStream('test content')
  const result = new Response(mockStream, {
    status: HttpStatusCode.Ok,
    headers: {
      'Content-Type': 'text/plain',
    },
  })

  await SendResponse.sendResponse(mockResponse, result)
  expect(mockResponse.statusCode).toBe(HttpStatusCode.Ok)
  expect(mockResponse.getHeader('Content-Type')).toBe('text/plain')
  expect((mockResponse as any).getContent()).toBe('test content')
})

test.skip('sendResponse - handles response without body', async () => {
  const mockResponse = createMockResponse()
  const result = new Response(null, {
    status: HttpStatusCode.NotModified,
    headers: {
      ETag: '"123"',
    },
  })
  await SendResponse.sendResponse(mockResponse, result)
  expect(mockResponse.statusCode).toBe(HttpStatusCode.NotModified)
  expect(mockResponse.getHeader('ETag')).toBe('"123"')
  expect((mockResponse as any).getContent()).toBe('')
})

test('sendResponse - handles ENOENT error', async () => {
  const mockResponse = createMockResponse()
  const error = new Error('ENOENT')
  // @ts-ignore
  error.code = 'ENOENT'
  const mockStream = createMockReadableStream('')
  const result = new Response(mockStream)
  const promise = SendResponse.sendResponse(mockResponse, result)
  mockStream.destroy(error)
  await promise
  expect(mockResponse.statusCode).toBe(HttpStatusCode.NotFound)
  expect((mockResponse as any).getContent()).toBe('Not Found')
})

test('sendResponse - handles stream premature close', async () => {
  const mockResponse = createMockResponse()
  const error = new Error('premature close')
  // @ts-ignore
  error.code = 'ERR_STREAM_PREMATURE_CLOSE'
  const mockStream = createMockReadableStream('')

  const result = new Response(mockStream)
  const promise = SendResponse.sendResponse(mockResponse, result)
  mockStream.destroy(error)
  await promise
  expect(mockResponse.statusCode).toBe(HttpStatusCode.Ok)
})

test('sendResponse - handles other errors', async () => {
  const mockResponse = createMockResponse()
  const error = new Error('Unknown error')
  const mockStream = createMockReadableStream('')
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {})

  const result = new Response(mockStream)
  const promise = SendResponse.sendResponse(mockResponse, result)
  mockStream.destroy(error)
  await promise
  expect(mockResponse.statusCode).toBe(HttpStatusCode.ServerError)
  expect((mockResponse as any).getContent()).toBe('Internal Server Error')
  expect(spy).toHaveBeenCalledWith('[preview-process] Error: Unknown error')
})

test('sendResponse - does not modify headers if already sent', async () => {
  const mockResponse = createMockResponse()
  // @ts-ignore
  mockResponse.headersSent = true
  const error = new Error('Unknown error')
  const mockStream = createMockReadableStream('')

  const result = new Response(mockStream)
  const promise = SendResponse.sendResponse(mockResponse, result)
  mockStream.destroy(error)
  await promise
  expect(mockResponse.statusCode).toBe(200)
})
