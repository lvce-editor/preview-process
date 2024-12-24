import { beforeEach, expect, jest, test } from '@jest/globals'
import * as HttpMethod from '../src/parts/HttpMethod/HttpMethod.ts'
import * as HttpStatusCode from '../src/parts/HttpStatusCode/HttpStatusCode.ts'
import * as SetInfo from '../src/parts/SetInfo/SetInfo.ts'

beforeEach(() => {
  jest.resetAllMocks()
  const id = 1
  const webviewId = 'test'
  const webViewRoot = '/test'
  const csp = ''
  const iframeContent = '<h1>hello world</h1>'
  SetInfo.setInfo(id, webviewId, webViewRoot, csp, iframeContent)
})

jest.unstable_mockModule('../src/parts/FileSystem/FileSystem.ts', () => {
  return {
    readFile: jest.fn(),
  }
})

const WebViewProtocol = await import('../src/parts/WebViewProtocol/WebViewProtocol.ts')
const FileSystem = await import('../src/parts/FileSystem/FileSystem.ts')

test('method not allowed - post', async () => {
  const method = HttpMethod.Post
  const url = 'lvce-webview://test/media'
  expect(await WebViewProtocol.getResponse(method, url)).toEqual({
    body: '405 - Method not allowed',
    init: {
      status: HttpStatusCode.MethodNotAllowed,
      headers: {
        'Cross-Origin-Resource-Policy': 'cross-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp',
      },
    },
  })
})

test('get - css file', async () => {
  const method = HttpMethod.Get
  const url = 'lvce-webview://test/media/index.css'
  jest.spyOn(FileSystem, 'readFile').mockResolvedValue(Buffer.from('a'))
  expect(await WebViewProtocol.getResponse(method, url)).toEqual({
    body: Buffer.from('a'),
    init: {
      status: HttpStatusCode.Ok,
      headers: {
        'Content-Type': 'text/css',
        'Cross-Origin-Resource-Policy': 'same-origin',
      },
    },
  })
})

test('get - javascript file', async () => {
  const method = HttpMethod.Get
  const url = 'lvce-webview://test/media/script.js'
  jest.spyOn(FileSystem, 'readFile').mockResolvedValue(Buffer.from('console.log("test")'))
  expect(await WebViewProtocol.getResponse(method, url)).toEqual({
    body: Buffer.from('console.log("test")'),
    init: {
      status: HttpStatusCode.Ok,
      headers: {
        'Content-Type': 'text/javascript',
        'Cross-Origin-Resource-Policy': 'same-origin',
      },
    },
  })
})

test('get - file not found', async () => {
  const method = HttpMethod.Get
  const url = 'lvce-webview://test/not-found.txt'
  const error = new Error('ENOENT: no such file')
  // @ts-ignore
  error.code = 'ENOENT'
  jest.spyOn(FileSystem, 'readFile').mockRejectedValue(error)
  expect(await WebViewProtocol.getResponse(method, url)).toEqual({
    body: '404 - Not Found',
    init: {
      headers: {
        'Content-Type': 'text/html',
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Cross-Origin-Resource-Policy': 'cross-origin',
      },
      status: HttpStatusCode.NotFound,
    },
  })
})

test('get - preview injected', async () => {
  const method = HttpMethod.Get
  const url = 'lvce-webview://test/preview-injected.js'
  expect(await WebViewProtocol.getResponse(method, url)).toEqual({
    body: expect.any(String),
    init: {
      status: HttpStatusCode.Ok,
      headers: {
        'Content-Type': 'text/javascript',
        'Cross-Origin-Resource-Policy': 'same-origin',
      },
    },
  })
})

test('get - index.html', async () => {
  const method = HttpMethod.Get
  const url = 'lvce-webview://test/index.html'
  expect(await WebViewProtocol.getResponse(method, url)).toEqual({
    body: undefined,
    init: {
      status: HttpStatusCode.Ok,
      headers: {
        'Content-Type': 'text/html',
        'Cross-Origin-Resource-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp',
      },
    },
  })
})

test('get - invalid protocol', async () => {
  const method = HttpMethod.Get
  const url = 'invalid://test/file.txt'
  await expect(WebViewProtocol.getResponse(method, url)).rejects.toThrow('unsupported protocol')
})

test('get - invalid url format', async () => {
  const method = HttpMethod.Get
  const url = 'not-a-url'
  await expect(WebViewProtocol.getResponse(method, url)).rejects.toThrow('Failed to parse url')
})
