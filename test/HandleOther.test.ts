import { beforeEach, expect, jest, test } from '@jest/globals'
import * as HttpStatusCode from '../src/parts/HttpStatusCode/HttpStatusCode.ts'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/FileSystem/FileSystem.ts', () => {
  return {
    readFile: jest.fn(),
  }
})

const HandleOther = await import('../src/parts/HandleOther/HandleOther.ts')
const FileSystem = await import('../src/parts/FileSystem/FileSystem.ts')

class FileNotFoundError extends Error {
  constructor() {
    super('ENOENT: no such file')
    // @ts-ignore
    this.code = 'ENOENT'
  }
}

test('not found', async () => {
  jest.spyOn(FileSystem, 'readFile').mockRejectedValue(new FileNotFoundError())
  const range = ''
  const response = await HandleOther.handleOther('/test/not-found.txt', range)
  expect(response.status).toBe(HttpStatusCode.NotFound)
  expect(await response.text()).toBe('not found')
  expect(response.headers.get('Cross-Origin-Resource-Policy')).toBe('same-origin')
})

test('normal file', async () => {
  jest.spyOn(FileSystem, 'readFile').mockResolvedValue(Buffer.from('ok'))
  const range = ''
  const response = await HandleOther.handleOther('/test/file.txt', range)
  expect(response.status).toBe(HttpStatusCode.Ok)
  expect(await response.text()).toBe('ok')
  expect(response.headers.get('Content-Type')).toBe('text/plain')
  expect(response.headers.get('Cross-Origin-Resource-Policy')).toBe('same-origin')
})

test('css file', async () => {
  jest.spyOn(FileSystem, 'readFile').mockResolvedValue(Buffer.from('.test{color:red}'))
  const range = ''
  const response = await HandleOther.handleOther('/test/styles.css', range)
  expect(response.status).toBe(HttpStatusCode.Ok)
  expect(await response.text()).toBe('.test{color:red}')
  expect(response.headers.get('Content-Type')).toBe('text/css')
})

test('internal server error', async () => {
  const error = new Error('Internal error')
  jest.spyOn(FileSystem, 'readFile').mockRejectedValue(error)
  const range = ''
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
  const response = await HandleOther.handleOther('/test/file.txt', range)
  expect(await response.text()).toBe('[preview-server] Error: Internal error')
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith(error)
})

test('with range header', async () => {
  const range = 'bytes=0-100'
  const response = await HandleOther.handleOther('/test/video.mp4', range)
  // TODO
  // expect(response.headers.get('Accept-Ranges')).toBe('bytes')
})
