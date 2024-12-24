import { expect, test } from '@jest/globals'
import getPort from 'get-port'
import { createPreviewProcess } from '../src/parts/CreatePreviewProcess/CreatePreviewProcess.js'
import { get } from '../src/parts/Get/Get.js'

test('preview process - serves injected js', async () => {
  const previewProcess = createPreviewProcess()
  const id = 1
  const port = await getPort()
  const root = new URL('../../../', import.meta.url)

  await previewProcess.invoke('WebViewServer.create', id)
  await previewProcess.invoke('WebViewServer.setHandler', id, '', root, '', '')
  await previewProcess.invoke('WebViewServer.start', id, port)

  const response = await get(`http://localhost:${port}/preview-injected.js`)
  expect(response.status).toBe(200)
  expect(response.headers.get('content-type')).toBe('text/javascript')

  const text = await response.text()
  expect(text).toContain('handleMessage')
  expect(text).toContain('handleWindowMessage')

  previewProcess[Symbol.dispose]()
})
