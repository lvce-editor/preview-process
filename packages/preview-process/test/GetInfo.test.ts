import { expect, test } from '@jest/globals'
import * as GetInfo from '../src/parts/GetInfo/GetInfo.ts'
import * as SetInfo from '../src/parts/SetInfo/SetInfo.ts'

test('getInfo - returns correct info', () => {
  const id = 1
  const webViewId = 'test'
  const webViewRoot = '/test'
  const contentSecurityPolicy = "default-src 'self'"
  const iframeContent = '<h1>Hello World</h1>'

  SetInfo.setInfo(id, webViewId, webViewRoot, contentSecurityPolicy, iframeContent)

  const info = GetInfo.getInfo('lvce-webview://test')
  expect(info).toEqual({
    webViewId,
    webViewRoot,
    contentSecurityPolicy,
    iframeContent,
  })
})

test('getInfo - throws error for invalid url format', () => {
  expect(() => GetInfo.getInfo('invalid-url')).toThrow('Failed to parse url')
})

test('getInfo - throws error for unsupported protocol', () => {
  expect(() => GetInfo.getInfo('unsupported://test-domain')).toThrow('unsupported protocol')
})

test('getInfo - throws error when info not found', () => {
  expect(() => GetInfo.getInfo('lvce-webview://unknown-domain')).toThrow('webview info not found')
})
