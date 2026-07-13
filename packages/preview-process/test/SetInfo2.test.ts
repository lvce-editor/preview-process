import { expect, test } from '@jest/globals'
import type { Info } from '../src/parts/Info.ts'
import * as GetInfo from '../src/parts/GetInfo/GetInfo.ts'
import * as SetInfo2 from '../src/parts/SetInfo2/SetInfo2.ts'

test('setInfo2 - stores info correctly', () => {
  const options: Info = {
    contentSecurityPolicy: "default-src 'self'",
    iframeContent: '<h1>Test Content</h1>',
    webViewId: 'test-view',
    webViewRoot: 'file:///test/root',
  }

  SetInfo2.setInfo2(options)

  const info = GetInfo.getInfo('lvce-webview://test-view')
  expect(info).toEqual({
    contentSecurityPolicy: options.contentSecurityPolicy,
    iframeContent: options.iframeContent,
    webViewId: options.webViewId,
    webViewRoot: options.webViewRoot,
  })
})

test('setInfo2 - handles file:// URI correctly', () => {
  const options: Info = {
    contentSecurityPolicy: "default-src 'self'",
    iframeContent: '<h1>Test Content</h1>',
    webViewId: 'test-view',
    webViewRoot: 'file:///test/root',
  }

  SetInfo2.setInfo2(options)

  const info = GetInfo.getInfo('lvce-webview://test-view')
  expect(info).toEqual({
    contentSecurityPolicy: options.contentSecurityPolicy,
    iframeContent: options.iframeContent,
    webViewId: options.webViewId,
    webViewRoot: 'file:///test/root',
  })
})
