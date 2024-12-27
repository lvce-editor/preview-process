import { expect, test } from '@jest/globals'
import * as SetInfo from '../src/parts/SetInfo/SetInfo.ts'
import * as GetInfo from '../src/parts/GetInfo/GetInfo.ts'

test('setInfo - stores info correctly', () => {
  const id = 1
  const webViewId = 'test-view'
  const webViewRoot = '/test/root'
  const contentSecurityPolicy = "default-src 'self'"
  const iframeContent = '<h1>Test Content</h1>'

  SetInfo.setInfo(id, webViewId, webViewRoot, contentSecurityPolicy, iframeContent)

  const info = GetInfo.getInfo('lvce-webview://test-view')
  expect(info).toEqual({
    webViewId,
    webViewRoot,
    contentSecurityPolicy,
    iframeContent,
  })
})

test.skip('setInfo - overwrites existing info with same id', () => {
  const id = 1
  const initialWebViewId = 'initial-view'
  const updatedWebViewId = 'updated-view'
  const webViewRoot = '/test/root'
  const contentSecurityPolicy = "default-src 'self'"
  const iframeContent = '<h1>Test Content</h1>'

  SetInfo.setInfo(id, initialWebViewId, webViewRoot, contentSecurityPolicy, iframeContent)
  SetInfo.setInfo(id, updatedWebViewId, webViewRoot, contentSecurityPolicy, iframeContent)

  expect(() => GetInfo.getInfo('lvce-webview://initial-view')).toThrow('webview info not found')

  const updatedInfo = GetInfo.getInfo('lvce-webview://updated-view')
  expect(updatedInfo).toEqual({
    webViewId: updatedWebViewId,
    webViewRoot,
    contentSecurityPolicy,
    iframeContent,
  })
})

test.skip('setInfo - handles multiple different ids', () => {
  const id1 = 1
  const id2 = 2
  const webViewId1 = 'view-1'
  const webViewId2 = 'view-2'
  const webViewRoot = '/test/root'
  const contentSecurityPolicy = "default-src 'self'"
  const iframeContent = '<h1>Test Content</h1>'

  SetInfo.setInfo(id1, webViewId1, webViewRoot, contentSecurityPolicy, iframeContent)
  SetInfo.setInfo(id2, webViewId2, webViewRoot, contentSecurityPolicy, iframeContent)

  const info1 = GetInfo.getInfo('lvce-webview://view-1')
  const info2 = GetInfo.getInfo('lvce-webview://view-2')

  expect(info1.webViewId).toBe(webViewId1)
  expect(info2.webViewId).toBe(webViewId2)
})
