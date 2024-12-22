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

  const range = 'bytes=0-100'
  const response = await HandleRangeRequest.handleRangeRequest('/test/video.mp4', range)

  expect(response.status).toBe(HttpStatusCode.PartialContent)
  expect(response.headers.get('Content-Range')).toBe('bytes 0-100/1000')
  expect(response.headers.get('Content-Length')).toBe('101')
  expect(response.headers.get('Accept-Ranges')).toBe('bytes')
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

  const range = 'bytes=0-1000'
  const response = await HandleRangeRequest.handleRangeRequest('/test/video.mp4', range)

  expect(response.status).toBe(HttpStatusCode.PartialContent)
  expect(response.headers.get('Content-Range')).toBe('bytes 0-499/500')
  expect(response.headers.get('Content-Length')).toBe('500')
})

test('handleRangeRequest - should handle range request with start beyond file size', async () => {
  const mockStat = {
    size: 100,
  }
  jest.spyOn(FsPromises, 'stat').mockResolvedValue(mockStat as any)

  const range = 'bytes=200-300'
  const response = await HandleRangeRequest.handleRangeRequest('/test/video.mp4', range)

  expect(response.status).toBe(HttpStatusCode.OtherError)
  expect(response.headers.get('Content-Range')).toBe('bytes */100')
})
