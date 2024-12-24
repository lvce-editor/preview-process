import { expect, jest, test } from '@jest/globals'
import * as ErrorCodes from '../src/parts/ErrorCodes/ErrorCodes.ts'
import type { Info } from '../src/parts/Info.ts'

jest.unstable_mockModule('../src/parts/FileSystem/FileSystem.ts', () => {
  return {
    readFile: jest.fn(),
  }
})

const GetWebViewRootResponse = await import('../src/parts/GetWebViewRootResponse/GetWebViewRootResponse.ts')
const FileSystem = await import('../src/parts/FileSystem/FileSystem.ts')

const mockInfo: Info = {
  webViewId: 'test',
  webViewRoot: '/test',
  contentSecurityPolicy: '',
  iframeContent: '',
}

test('getWebViewRootResponse - file not found', async () => {
  const error = new Error('ENOENT: no such file')
  // @ts-ignore
  error.code = ErrorCodes.ENOENT
  jest.spyOn(FileSystem, 'readFile').mockRejectedValue(error)

  const response = await GetWebViewRootResponse.getWebViewRootResponse(mockInfo, '/not-found.txt')
  expect(response).toEqual({
    body: '404 - Not Found',
    init: {
      headers: {
        'Content-Type': 'text/html',
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Cross-Origin-Resource-Policy': 'cross-origin',
      },
      status: 404,
    },
  })
})

test('getWebViewRootResponse - internal server error', async () => {
  const error = new Error('Unknown error')
  jest.spyOn(FileSystem, 'readFile').mockRejectedValue(error)

  const response = await GetWebViewRootResponse.getWebViewRootResponse(mockInfo, '/error.txt')
  expect(response).toEqual({
    body: '500 - Internal Server Error',
    init: {
      status: 500,
      headers: {
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Cross-Origin-Resource-Policy': 'cross-origin',
      },
    },
  })
})

test('getWebViewRootResponse - success', async () => {
  jest.spyOn(FileSystem, 'readFile').mockResolvedValue(Buffer.from('test content'))

  const response = await GetWebViewRootResponse.getWebViewRootResponse(mockInfo, '/test.txt')
  expect(response).toEqual({
    body: Buffer.from('test content'),
    init: {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Cross-Origin-Resource-Policy': 'same-origin',
      },
    },
  })
})
