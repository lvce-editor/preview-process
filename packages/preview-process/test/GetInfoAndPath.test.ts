import { expect, test } from '@jest/globals'
import * as GetInfoAndPath from '../src/parts/GetInfoAndPath/GetInfoAndPath.ts'
import * as SetInfo2 from '../src/parts/SetInfo2/SetInfo2.ts'

test('getInfoAndPath - root path', () => {
  const info = {
    webViewId: 'xyz',
    webViewRoot: '/test/root',
    contentSecurityPolicy: '',
    iframeContent: '<h1>test</h1>',
  }
  SetInfo2.setInfo2(info)

  const result = GetInfoAndPath.getInfoAndPath('http://localhost:3000/xyz')
  expect(result).toEqual({
    info,
    pathName: '/index.html',
  })
})

test('getInfoAndPath - root path with trailing slash', () => {
  const info = {
    webViewId: 'xyz',
    webViewRoot: '/test/root',
    contentSecurityPolicy: '',
    iframeContent: '<h1>test</h1>',
  }
  SetInfo2.setInfo2(info)

  const result = GetInfoAndPath.getInfoAndPath('http://localhost:3000/xyz/')
  expect(result).toEqual({
    info,
    pathName: '/index.html',
  })
})

test('getInfoAndPath - subpath', () => {
  const info = {
    webViewId: 'xyz',
    webViewRoot: '/test/root',
    contentSecurityPolicy: '',
    iframeContent: '<h1>test</h1>',
  }
  SetInfo2.setInfo2(info)

  const result = GetInfoAndPath.getInfoAndPath('http://localhost:3000/xyz/media/index.js')
  expect(result).toEqual({
    info,
    pathName: '/media/index.js',
  })
})

test('getInfoAndPath - unknown webview', () => {
  const result = GetInfoAndPath.getInfoAndPath('http://localhost:3000/unknown/test.js')
  expect(result).toBeUndefined()
})

test('getInfoAndPath - invalid url', () => {
  const result = GetInfoAndPath.getInfoAndPath('invalid-url')
  expect(result).toBeUndefined()
})
