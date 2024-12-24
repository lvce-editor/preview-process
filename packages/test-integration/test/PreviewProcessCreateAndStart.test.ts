import { expect, test } from '@jest/globals'
import { fileURLToPath } from 'node:url'
import { createPreviewProcess } from '../src/parts/CreatePreviewProcess/CreatePreviewProcess.js'
import { get } from '../src/parts/Get/Get.js'

test('preview process - create and start server', async () => {
  const previewProcess = createPreviewProcess()
  const id = 1
  const port = '3000'
  const root = fileURLToPath(new URL('../test', import.meta.url))

  await previewProcess.invoke('WebViewServer.create', id)
  await previewProcess.invoke('WebViewServer.setInfo', id, 'test', root, '', '<h1>Hello World</h1>')
  await previewProcess.invoke('WebViewServer.setHandler', id, '', root, '', '<h1>Hello World</h1>')
  await previewProcess.invoke('WebViewServer.start', id, port)

  const response = await get('http://localhost:3000')
  expect(response.status).toBe(200)
  expect(await response.text()).toBe('<h1>Hello World</h1>')

  previewProcess[Symbol.dispose]()
})
