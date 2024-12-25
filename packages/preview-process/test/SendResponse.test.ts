import { expect, jest, test } from '@jest/globals'
import { Readable } from 'node:stream'
import { ServerResponse } from 'node:http'
import { EventEmitter } from 'node:events'
import * as SendResponse from '../src/parts/SendResponse/SendResponse.ts'
import * as HttpStatusCode from '../src/parts/HttpStatusCode/HttpStatusCode.ts'

class MockServerResponse extends EventEmitter {
  statusCode = 200
  #headersSent = false

  get headersSent() {
    return this.#headersSent
  }

  set headersSent(value) {
    this.#headersSent = value
  }
  headers = new Map()

  setHeader(key: string, value: string) {
    this.headers.set(key, value)
  }

  end(chunk?: string) {
    if (chunk) {
      this.emit('data', chunk)
    }
    this.emit('end')
  }

  writeHead(statusCode: number, headers: object) {
    this.statusCode = statusCode
    for (const [key, value] of Object.entries(headers)) {
      this.setHeader(key, value)
    }
  }
}

const createMockResponse = () => {
  return new MockServerResponse() as unknown as ServerResponse
}

const createMockStream = (content: string) =>
  new Readable({
    read() {
      this.push(content)
      this.push(null)
    },
  })

test('sendResponse - handles successful response with body', async () => {
  const mockResponse = createMockResponse()
  const mockStream = createMockStream('test content')
  const result = new Response(mockStream, {
    status: HttpStatusCode.Ok,
    headers: {
      'Content-Type': 'text/plain',
    },
  })

  await SendResponse.sendResponse(mockResponse, result)
  expect(mockResponse.statusCode).toBe(HttpStatusCode.Ok)
  expect(mockResponse.getHeader('Content-Type')).toBe('text/plain')
})

test('sendResponse - handles response without body', async () => {
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
})

test('sendResponse - handles ENOENT error', async () => {
  const mockResponse = createMockResponse()
  const error = new Error('ENOENT')
  // @ts-ignore
  error.code = 'ENOENT'
  const mockStream = new Readable({
    read() {
      this.emit('error', error)
    },
  })

  const result = new Response(mockStream)
  await SendResponse.sendResponse(mockResponse, result)
  expect(mockResponse.statusCode).toBe(HttpStatusCode.NotFound)
})

test('sendResponse - handles stream premature close', async () => {
  const mockResponse = createMockResponse()
  const error = new Error('premature close')
  // @ts-ignore
  error.code = 'ERR_STREAM_PREMATURE_CLOSE'
  const mockStream = new Readable({
    read() {
      this.emit('error', error)
    },
  })

  const result = new Response(mockStream)
  await SendResponse.sendResponse(mockResponse, result)
  expect(mockResponse.statusCode).toBe(HttpStatusCode.Ok) // Status should remain unchanged
})

test('sendResponse - handles other errors', async () => {
  const mockResponse = createMockResponse()
  const error = new Error('Unknown error')
  const mockStream = new Readable({
    read() {
      this.emit('error', error)
    },
  })
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {})

  const result = new Response(mockStream)
  await SendResponse.sendResponse(mockResponse, result)
  expect(mockResponse.statusCode).toBe(HttpStatusCode.ServerError)
  expect(spy).toHaveBeenCalledWith('[preview-process] Error: Unknown error')
})

test('sendResponse - does not modify headers if already sent', async () => {
  const mockResponse = createMockResponse()
  // @ts-ignore
  mockResponse.headersSent = true
  const error = new Error('Unknown error')
  const mockStream = new Readable({
    read() {
      this.emit('error', error)
    },
  })

  const result = new Response(mockStream)
  await SendResponse.sendResponse(mockResponse, result)
  expect(mockResponse.statusCode).toBe(200) // Should remain unchanged
})
