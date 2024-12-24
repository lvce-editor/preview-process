import { expect, test } from '@jest/globals'
import { createPreviewProcess } from '../src/parts/CreatePreviewProcess/CreatePreviewProcess.js'
import { get } from '../src/parts/Get/Get.js'
import { fileURLToPath } from 'node:url'

test('preview process - serves injected js', async () => {
  const previewProcess = createPreviewProcess()
  const id = 1
  const port = '3003'
  const root = fileURLToPath(new URL('../test', import.meta.url))

  await previewProcess.invoke('WebViewServer.create', id)
  await previewProcess.invoke('WebViewServer.setInfo', id, 'test', root, '', '')
  await previewProcess.invoke('WebViewServer.setHandler', id, '', root, '', '')
  await previewProcess.invoke('WebViewServer.start', id, port)

  const response = await get('http://localhost:3003/preview-injected.js')
  expect(response.status).toBe(200)
  expect(response.headers.get('content-type')).toBe('text/javascript')

  const text = await response.text()
  expect(text).toContain('handleMessage')
  expect(text).toContain('handleWindowMessage')

  previewProcess[Symbol.dispose]()
})
