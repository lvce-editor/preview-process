import { beforeEach, expect, jest, test } from '@jest/globals'
import { Writable } from 'node:stream'
import * as HttpStatusCode from '../src/parts/HttpStatusCode/HttpStatusCode.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('node:fs/promises', () => {
  return {
    stat: jest.fn(),
  }
})

jest.unstable_mockModule('node:fs', () => {
  return {
    createReadStream: jest.fn(),
  }
})

const HandleRangeRequest = await import('../src/parts/HandleRangeRequest/HandleRangeRequest.js')
const FsPromises = await import('node:fs/promises')
const Fs = await import('node:fs')

class MockServerResponse extends Writable {
  headers = new Map()
  statusCode = 200

  setHeader(key: string, value: any): void {
    this.headers.set(key, value)
  }

  getHeader(key: string): string {
    return this.headers.get(key)
  }

  writeHead(statusCode: number, headers: any): void {
    this.statusCode = statusCode
    for (const [key, value] of Object.entries(headers)) {
      this.setHeader(key, value)
    }
  }

  _write(chunk: any, encoding: string, callback: (error?: Error | null) => void): void {
    callback()
  }
}

test('handleRangeRequest - should handle valid range request', async () => {
  const mockStat = {
    size: 1000,
  }
  jest.spyOn(FsPromises, 'stat').mockResolvedValue(mockStat as any)
  const mockStream = new Writable({
    write(chunk, encoding, callback): void {
      callback()
    },
  })
  jest.spyOn(Fs, 'createReadStream').mockReturnValue(mockStream as any)

  const res = new MockServerResponse()
  const range = 'bytes=0-100'
  // @ts-expect-error
  await HandleRangeRequest.handleRangeRequest('/test/video.mp4', range, res)

  expect(res.statusCode).toBe(HttpStatusCode.PartialContent)
  expect(res.getHeader('Content-Range')).toBe('bytes 0-100/1000')
  expect(res.getHeader('Content-Length')).toBe(101)
  expect(res.getHeader('Accept-Ranges')).toBe('bytes')
})

test('handleRangeRequest - should handle range request with end beyond file size', async () => {
  const mockStat = {
    size: 500,
  }
  jest.spyOn(FsPromises, 'stat').mockResolvedValue(mockStat as any)
  const mockStream = new Writable({
    write(chunk, encoding, callback): void {
      callback()
    },
  })
  jest.spyOn(Fs, 'createReadStream').mockReturnValue(mockStream as any)

  const res = new MockServerResponse()
  const range = 'bytes=0-1000'
  // @ts-expect-error
  await HandleRangeRequest.handleRangeRequest('/test/video.mp4', range, res)

  expect(res.statusCode).toBe(HttpStatusCode.PartialContent)
  expect(res.getHeader('Content-Range')).toBe('bytes 0-499/500')
  expect(res.getHeader('Content-Length')).toBe(500)
})

test('handleRangeRequest - should handle range request with start beyond file size', async () => {
  const mockStat = {
    size: 100,
  }
  jest.spyOn(FsPromises, 'stat').mockResolvedValue(mockStat as any)

  const res = new MockServerResponse()
  const range = 'bytes=200-300'
  // @ts-expect-error
  await HandleRangeRequest.handleRangeRequest('/test/video.mp4', range, res)

  expect(res.statusCode).toBe(HttpStatusCode.OtherError)
  expect(res.getHeader('Content-Range')).toBe('bytes */100')
})
