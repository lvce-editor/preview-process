import { beforeEach, expect, jest, test } from '@jest/globals'
import { ServerResponse } from 'node:http'
import * as HttpStatusCode from '../src/parts/HttpStatusCode/HttpStatusCode.ts'
import * as HttpHeader from '../src/parts/HttpHeader/HttpHeader.ts'
import * as ErrorCodes from '../src/parts/ErrorCodes/ErrorCodes.ts'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('node:fs', () => {
  return {
    createReadStream: jest.fn(() => {
      const stream = new (require('stream').Readable)()
      stream.push('test content')
      stream.push(null)
      return stream
    }),
  }
})

jest.unstable_mockModule('node:fs/promises', () => {
  return {
    stat: jest.fn(),
  }
})

const HandleRangeRequest = await import('../src/parts/HandleRangeRequest/HandleRangeRequest.ts')
const fs = await import('node:fs')
const fsPromises = await import('node:fs/promises')

test('handleRangeRequest - normal range request', async () => {
  const filePath = '/test/file.txt'
  const range = 'bytes=0-4'
  const res = new ServerResponse({} as any)
  jest.spyOn(fsPromises, 'stat').mockResolvedValue({
    size: 100,
  } as any)

  await HandleRangeRequest.handleRangeRequest(filePath, range, res)

  expect(res.statusCode).toBe(HttpStatusCode.PartialContent)
  expect(res.getHeader(HttpHeader.ContentRange)).toBe('bytes 0-4/100')
  expect(res.getHeader(HttpHeader.ContentLength)).toBe(5)
  expect(res.getHeader(HttpHeader.AcceptRanges)).toBe('bytes')
})

test('handleRangeRequest - range exceeds file size', async () => {
  const filePath = '/test/file.txt'
  const range = 'bytes=0-200'
  const res = new ServerResponse({} as any)
  jest.spyOn(fsPromises, 'stat').mockResolvedValue({
    size: 100,
  } as any)

  await HandleRangeRequest.handleRangeRequest(filePath, range, res)

  expect(res.statusCode).toBe(HttpStatusCode.PartialContent)
  expect(res.getHeader(HttpHeader.ContentRange)).toBe('bytes 0-99/100')
  expect(res.getHeader(HttpHeader.ContentLength)).toBe(100)
})

test('handleRangeRequest - start position exceeds file size', async () => {
  const filePath = '/test/file.txt'
  const range = 'bytes=150-200'
  const res = new ServerResponse({} as any)
  jest.spyOn(fsPromises, 'stat').mockResolvedValue({
    size: 100,
  } as any)

  await HandleRangeRequest.handleRangeRequest(filePath, range, res)

  expect(res.statusCode).toBe(HttpStatusCode.OtherError)
  expect(res.getHeader(HttpHeader.ContentRange)).toBe('bytes */100')
})

test('handleRangeRequest - handles stream premature close error', async () => {
  const filePath = '/test/file.txt'
  const range = 'bytes=0-4'
  const res = new ServerResponse({} as any)
  jest.spyOn(fsPromises, 'stat').mockResolvedValue({
    size: 100,
  } as any)

  const mockStream = {
    pipe: jest.fn().mockImplementation(() => {
      throw { code: ErrorCodes.ERR_STREAM_PREMATURE_CLOSE }
    }),
  }
  jest.spyOn(fs, 'createReadStream').mockReturnValue(mockStream as any)

  await HandleRangeRequest.handleRangeRequest(filePath, range, res)

  expect(res.statusCode).toBe(HttpStatusCode.PartialContent)
})

test('handleRangeRequest - no end specified', async () => {
  const filePath = '/test/file.txt'
  const range = 'bytes=5-'
  const res = new ServerResponse({} as any)
  jest.spyOn(fsPromises, 'stat').mockResolvedValue({
    size: 100,
  } as any)

  await HandleRangeRequest.handleRangeRequest(filePath, range, res)

  expect(res.statusCode).toBe(HttpStatusCode.PartialContent)
  expect(res.getHeader(HttpHeader.ContentRange)).toBe('bytes 5-99/100')
  expect(res.getHeader(HttpHeader.ContentLength)).toBe(95)
})

test('handleRangeRequest - no start specified', async () => {
  const filePath = '/test/file.txt'
  const range = 'bytes=-10'
  const res = new ServerResponse({} as any)
  jest.spyOn(fsPromises, 'stat').mockResolvedValue({
    size: 100,
  } as any)

  await HandleRangeRequest.handleRangeRequest(filePath, range, res)

  expect(res.statusCode).toBe(HttpStatusCode.PartialContent)
  expect(res.getHeader(HttpHeader.ContentRange)).toBe('bytes 0-10/100')
  expect(res.getHeader(HttpHeader.ContentLength)).toBe(11)
})
