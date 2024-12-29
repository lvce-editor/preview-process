import { expect, test } from '@jest/globals'
import * as GetInfo from '../src/parts/GetInfo/GetInfo.ts'
import * as SetInfo2 from '../src/parts/SetInfo2/SetInfo2.ts'

test('setInfo2 - stores info correctly', () => {
  const options: SetInfo2.SetInfoOptions = {
    id: 1,
    webViewId: 'test-view',
    webViewUri: '/test/root',
    contentSecurityPolicy: "default-src 'self'",
    iframeContent: '<h1>Test Content</h1>',
  }

  SetInfo2.setInfo2(options)

  const info = GetInfo.getInfo('lvce-webview://test-view')
  expect(info).toEqual({
    webViewId: options.webViewId,
    webViewRoot: options.webViewUri,
    contentSecurityPolicy: options.contentSecurityPolicy,
    iframeContent: options.iframeContent,
  })
})

test('setInfo2 - handles file:// URI correctly', () => {
  const options: SetInfo2.SetInfoOptions = {
    id: 1,
    webViewId: 'test-view',
    webViewUri: 'file:///test/root',
    contentSecurityPolicy: "default-src 'self'",
    iframeContent: '<h1>Test Content</h1>',
  }

  SetInfo2.setInfo2(options)

  const info = GetInfo.getInfo('lvce-webview://test-view')
  expect(info).toEqual({
    webViewId: options.webViewId,
    webViewRoot: '/test/root',
    contentSecurityPolicy: options.contentSecurityPolicy,
    iframeContent: options.iframeContent,
  })
})
