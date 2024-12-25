import { beforeEach, expect, jest, test } from '@jest/globals'
import { Readable } from 'node:stream'
import * as HttpStatusCode from '../src/parts/HttpStatusCode/HttpStatusCode.ts'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/FileSystem/FileSystem.ts', () => {
  return {
    readFile: jest.fn(),
  }
})

jest.unstable_mockModule('../src/parts/GetPathEtag/GetPathEtag.ts', () => {
  return {
    getPathEtag: jest.fn(),
  }
})

jest.unstable_mockModule('node:fs', () => {
  return {
    createReadStream: jest.fn(),
  }
})

const HandleOther = await import('../src/parts/HandleOther/HandleOther.ts')
const FileSystem = await import('../src/parts/FileSystem/FileSystem.ts')
const GetPathEtag = await import('../src/parts/GetPathEtag/GetPathEtag.ts')
const Fs = await import('node:fs')

class FileNotFoundError extends Error {
  constructor() {
    super('ENOENT: no such file')
    // @ts-ignore
    this.code = 'ENOENT'
  }
}

const handlerOptions = {
  webViewRoot: '',
  contentSecurityPolicy: '',
  iframeContent: '',
  stream: false,
}

test('not found', async () => {
  jest.spyOn(FileSystem, 'readFile').mockRejectedValue(new FileNotFoundError())
  const requestOptions = {
    method: 'GET',
    path: '/test/not-found.txt',
    headers: {},
  }
  const response = await HandleOther.handleOther(requestOptions.path, requestOptions, handlerOptions)
  expect(response.status).toBe(HttpStatusCode.NotFound)
  expect(await response.text()).toBe('not found')
  expect(response.headers.get('Cross-Origin-Resource-Policy')).toBe('same-origin')
})

test('normal file', async () => {
  const etag = '"123"'
  jest.spyOn(GetPathEtag, 'getPathEtag').mockResolvedValue(etag)
  jest.spyOn(FileSystem, 'readFile').mockResolvedValue(Buffer.from('ok'))
  const requestOptions = {
    method: 'GET',
    path: '/test/file.txt',
    headers: {},
  }
  const response = await HandleOther.handleOther(requestOptions.path, requestOptions, handlerOptions)
  expect(response.status).toBe(HttpStatusCode.Ok)
  expect(await response.text()).toBe('ok')
  expect(response.headers.get('Content-Type')).toBe('text/plain')
  expect(response.headers.get('Cross-Origin-Resource-Policy')).toBe('same-origin')
  expect(response.headers.get('ETag')).toBe(etag)
})

test('css file', async () => {
  const etag = '"css123"'
  jest.spyOn(GetPathEtag, 'getPathEtag').mockResolvedValue(etag)
  jest.spyOn(FileSystem, 'readFile').mockResolvedValue(Buffer.from('.test{color:red}'))
  const requestOptions = {
    method: 'GET',
    path: '/test/styles.css',
    headers: {},
  }
  const response = await HandleOther.handleOther(requestOptions.path, requestOptions, handlerOptions)
  expect(response.status).toBe(HttpStatusCode.Ok)
  expect(await response.text()).toBe('.test{color:red}')
  expect(response.headers.get('Content-Type')).toBe('text/css')
  expect(response.headers.get('ETag')).toBe(etag)
})

test('internal server error', async () => {
  const error = new Error('Internal error')
  jest.spyOn(GetPathEtag, 'getPathEtag').mockRejectedValue(error)
  const requestOptions = {
    method: 'GET',
    path: '/test/file.txt',
    headers: {},
  }
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
  const response = await HandleOther.handleOther(requestOptions.path, requestOptions, handlerOptions)
  expect(await response.text()).toBe('Internal Server Error')
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith(`[preview-server] Error: Internal error`)
})

test('with range header', async () => {
  const requestOptions = {
    method: 'GET',
    path: '/test/video.mp4',
    range: 'bytes=0-100',
    headers: {},
  }
  const response = await HandleOther.handleOther(requestOptions.path, requestOptions, handlerOptions)
  // TODO
  // expect(response.headers.get('Accept-Ranges')).toBe('bytes')
})

test('should return 304 when etag matches', async () => {
  const mockEtag = '"123"'
  jest.spyOn(GetPathEtag, 'getPathEtag').mockResolvedValue(mockEtag)
  jest.spyOn(FileSystem, 'readFile').mockResolvedValue(Buffer.from('test'))

  const requestOptions = {
    method: 'GET',
    path: '/test/file.txt',
    headers: {
      'if-none-match': mockEtag,
    },
  }
  const response = await HandleOther.handleOther(requestOptions.path, requestOptions, handlerOptions)
  expect(response.status).toBe(HttpStatusCode.NotModified)
  expect(response.headers.get('ETag')).toBe(mockEtag)
  expect(await response.text()).toBe('')
})

test('should return 200 with etag when etag does not match', async () => {
  const mockEtag = '"123"'
  jest.spyOn(GetPathEtag, 'getPathEtag').mockResolvedValue(mockEtag)
  jest.spyOn(FileSystem, 'readFile').mockResolvedValue(Buffer.from('test'))

  const requestOptions = {
    method: 'GET',
    path: '/test/file.txt',
    headers: {
      'if-none-match': '"456"',
    },
  }
  const response = await HandleOther.handleOther(requestOptions.path, requestOptions, handlerOptions)
  expect(response.status).toBe(HttpStatusCode.Ok)
  expect(response.headers.get('ETag')).toBe(mockEtag)
  expect(await response.text()).toBe('test')
})

test('should return 200 with etag when no if-none-match header', async () => {
  const mockEtag = '"123"'
  jest.spyOn(GetPathEtag, 'getPathEtag').mockResolvedValue(mockEtag)
  jest.spyOn(FileSystem, 'readFile').mockResolvedValue(Buffer.from('test'))

  const requestOptions = {
    method: 'GET',
    path: '/test/file.txt',
    headers: {},
  }
  const response = await HandleOther.handleOther(requestOptions.path, requestOptions, handlerOptions)
  expect(response.status).toBe(HttpStatusCode.Ok)
  expect(response.headers.get('ETag')).toBe(mockEtag)
  expect(await response.text()).toBe('test')
})

test('should return 404 when getPathEtag returns null', async () => {
  // @ts-ignore
  jest.spyOn(GetPathEtag, 'getPathEtag').mockResolvedValue(null)

  const requestOptions = {
    method: 'GET',
    path: '/test/file.txt',
    headers: {},
  }
  const response = await HandleOther.handleOther(requestOptions.path, requestOptions, handlerOptions)
  expect(response.status).toBe(HttpStatusCode.NotFound)
  expect(await response.text()).toBe('not found')
})

test('with matching etag', async () => {
  const etag = '"123"'
  jest.spyOn(GetPathEtag, 'getPathEtag').mockResolvedValue(etag)
  const requestOptions = {
    method: 'GET',
    path: '/test/file.txt',
    headers: {
      'if-none-match': etag,
    },
  }
  const response = await HandleOther.handleOther(requestOptions.path, requestOptions, handlerOptions)
  expect(response.status).toBe(HttpStatusCode.NotModified)
  expect(response.headers.get('ETag')).toBe(etag)
})

test('with non-matching etag', async () => {
  const etag = '"123"'
  jest.spyOn(GetPathEtag, 'getPathEtag').mockResolvedValue(etag)
  jest.spyOn(FileSystem, 'readFile').mockResolvedValue(Buffer.from('test content'))
  const requestOptions = {
    method: 'GET',
    path: '/test/file.txt',
    headers: {
      'if-none-match': '"456"',
    },
  }
  const response = await HandleOther.handleOther(requestOptions.path, requestOptions, handlerOptions)
  expect(response.status).toBe(HttpStatusCode.Ok)
  expect(response.headers.get('ETag')).toBe(etag)
  expect(await response.text()).toBe('test content')
})

test('streaming response', async () => {
  const etag = '"123"'
  const mockStream = new Readable({
    read(): void {
      this.push('test content')
      this.push(null)
    },
  })
  jest.spyOn(GetPathEtag, 'getPathEtag').mockResolvedValue(etag)
  jest.spyOn(Fs, 'createReadStream').mockReturnValue(mockStream as any)

  const streamingOptions = { ...handlerOptions, stream: true }
  const requestOptions = {
    method: 'GET',
    path: '/test/file.txt',
    headers: {},
  }

  const response = await HandleOther.handleOther(requestOptions.path, requestOptions, streamingOptions)
  expect(response.status).toBe(HttpStatusCode.Ok)
  expect(response.headers.get('Content-Type')).toBe('text/plain')
  expect(response.headers.get('ETag')).toBe(etag)
  expect(await response.text()).toBe('test content')
})
