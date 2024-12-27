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
  const response = await WebViewProtocol.getResponse(method, url)
  expect(response.init).toEqual({
    status: HttpStatusCode.MethodNotAllowed,
    headers: {
      'Content-Type': 'text/plain;charset=UTF-8',
      'Cross-Origin-Resource-Policy': 'same-origin',
    },
  })
  expect(response.body.toString()).toBe('405 - Method Not Allowed')
})

test('get - css file', async () => {
  const method = HttpMethod.Get
  const url = 'lvce-webview://test/media/index.css'
  jest.spyOn(FileSystem, 'readFile').mockResolvedValue(Buffer.from('a'))
  const response = await WebViewProtocol.getResponse(method, url)
  expect(response.init).toEqual({
    status: HttpStatusCode.Ok,
    headers: {
      'Content-Type': 'text/css',
      'Cross-Origin-Resource-Policy': 'same-origin',
    },
  })
  expect(response.body.toString()).toBe('a')
})

test('get - javascript file', async () => {
  const method = HttpMethod.Get
  const url = 'lvce-webview://test/media/script.js'
  jest.spyOn(FileSystem, 'readFile').mockResolvedValue(Buffer.from('console.log("test")'))
  const response = await WebViewProtocol.getResponse(method, url)
  expect(response.init).toEqual({
    status: HttpStatusCode.Ok,
    headers: {
      'Content-Type': 'text/javascript',
      'Cross-Origin-Resource-Policy': 'same-origin',
    },
  })
  expect(response.body.toString()).toBe('console.log("test")')
})

test.skip('get - file not found', async () => {
  const method = HttpMethod.Get
  const url = 'lvce-webview://test/not-found.txt'
  const error = new Error('ENOENT: no such file')
  // @ts-ignore
  error.code = 'ENOENT'
  jest.spyOn(FileSystem, 'readFile').mockRejectedValue(error)
  const response = await WebViewProtocol.getResponse(method, url)
  expect(response.init).toEqual({
    headers: {
      'Content-Type': 'text/html',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Resource-Policy': 'cross-origin',
    },
    status: HttpStatusCode.NotFound,
  })
  expect(response.body.toString()).toBe('404 - Not Found')
})

test('get - preview injected', async () => {
  const method = HttpMethod.Get
  const url = 'lvce-webview://test/preview-injected.js'
  const response = await WebViewProtocol.getResponse(method, url)
  expect(response.init).toEqual({
    status: HttpStatusCode.Ok,
    headers: {
      'Content-Type': 'text/javascript',
      'Cross-Origin-Resource-Policy': 'same-origin',
    },
  })
  expect(response.body).toBeDefined()
})

test('get - index.html', async () => {
  const method = HttpMethod.Get
  const url = 'lvce-webview://test/index.html'
  const response = await WebViewProtocol.getResponse(method, url)
  expect(response.init).toEqual({
    status: HttpStatusCode.Ok,
    headers: {
      'Content-Type': 'text/html',
      'Cross-Origin-Resource-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  })
  expect(response.body).toBeUndefined()
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

test('method not allowed - put', async () => {
  const method = HttpMethod.Put
  const url = 'lvce-webview://test/media'
  expect(await WebViewProtocol.getResponse(method, url)).toEqual({
    body: Buffer.from('405 - Method Not Allowed'),
    init: {
      status: HttpStatusCode.MethodNotAllowed,
      headers: {
        'Content-Type': 'text/plain;charset=UTF-8',
        'Cross-Origin-Resource-Policy': 'same-origin',
      },
    },
  })
})

test('get - png image file', async () => {
  const method = HttpMethod.Get
  const url = 'lvce-webview://test/media/image.png'
  const imageBuffer = Buffer.from([137, 80, 78, 71]) // PNG magic numbers
  jest.spyOn(FileSystem, 'readFile').mockResolvedValue(imageBuffer)
  expect(await WebViewProtocol.getResponse(method, url)).toEqual({
    body: imageBuffer,
    init: {
      status: HttpStatusCode.Ok,
      headers: {
        'Content-Type': 'image/png',
        'Cross-Origin-Resource-Policy': 'same-origin',
      },
    },
  })
})

test('get - svg file', async () => {
  const method = HttpMethod.Get
  const url = 'lvce-webview://test/media/icon.svg'
  const svgContent = Buffer.from('<svg></svg>')
  jest.spyOn(FileSystem, 'readFile').mockResolvedValue(svgContent)
  expect(await WebViewProtocol.getResponse(method, url)).toEqual({
    body: svgContent,
    init: {
      status: HttpStatusCode.Ok,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cross-Origin-Resource-Policy': 'same-origin',
      },
    },
  })
})

test('get - json file', async () => {
  const method = HttpMethod.Get
  const url = 'lvce-webview://test/data/config.json'
  const jsonContent = Buffer.from('{"key": "value"}')
  jest.spyOn(FileSystem, 'readFile').mockResolvedValue(jsonContent)
  expect(await WebViewProtocol.getResponse(method, url)).toEqual({
    body: jsonContent,
    init: {
      status: HttpStatusCode.Ok,
      headers: {
        'Content-Type': 'application/json',
        'Cross-Origin-Resource-Policy': 'same-origin',
      },
    },
  })
})

test('get - unknown file type', async () => {
  const method = HttpMethod.Get
  const url = 'lvce-webview://test/data/unknown.xyz'
  const content = Buffer.from('content')
  jest.spyOn(FileSystem, 'readFile').mockResolvedValue(content)
  expect(await WebViewProtocol.getResponse(method, url)).toEqual({
    body: content,
    init: {
      status: HttpStatusCode.Ok,
      headers: {
        'Content-Type': 'text/plain',
        'Cross-Origin-Resource-Policy': 'same-origin',
      },
    },
  })
})

test.skip('get - permission error', async () => {
  const method = HttpMethod.Get
  const url = 'lvce-webview://test/protected/file.txt'
  const error = new Error('EACCES: permission denied')
  // @ts-ignore
  error.code = 'EACCES'
  jest.spyOn(FileSystem, 'readFile').mockRejectedValue(error)
  expect(await WebViewProtocol.getResponse(method, url)).toEqual({
    body: '403 - Forbidden',
    init: {
      status: HttpStatusCode.Forbidden,
      headers: {
        'Content-Type': 'text/html',
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Cross-Origin-Resource-Policy': 'cross-origin',
      },
    },
  })
})
