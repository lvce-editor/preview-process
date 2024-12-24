import { expect, test } from '@jest/globals'
import getPort from 'get-port'
import { createPreviewProcess } from '../src/parts/CreatePreviewProcess/CreatePreviewProcess.js'
import { get } from '../src/parts/Get/Get.js'

test('preview process - create and start server', async () => {
  const previewProcess = createPreviewProcess()
  const id = 1
  const port = await getPort()
  const root = new URL('../../../', import.meta.url)

  await previewProcess.invoke('WebViewServer.create', id)
  await previewProcess.invoke('WebViewServer.setHandler', id, '', root, '', '<h1>Hello World</h1>')
  await previewProcess.invoke('WebViewServer.start', id, port)

  const response = await get(`http://localhost:${port}`)
  expect(response.status).toBe(200)
  expect(await response.text()).toBe('<h1>Hello World</h1>')

  previewProcess[Symbol.dispose]()
})
