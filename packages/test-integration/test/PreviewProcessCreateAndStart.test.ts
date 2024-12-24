import { expect, test } from '@jest/globals'
import { createPreviewProcess } from '../src/parts/CreatePreviewProcess/CreatePreviewProcess.js'
import { get } from '../src/parts/Get/Get.js'

test.skip('preview process - create and start server', async () => {
  const previewProcess = createPreviewProcess()
  const id = 1
  const port = '3000'

  await previewProcess.invoke('WebViewServer.create', id)
  await previewProcess.invoke('WebViewServer.setInfo', id, 'test', '/test', '', '<h1>Hello World</h1>')
  await previewProcess.invoke('WebViewServer.setHandler', id, '', '/test', '', '<h1>Hello World</h1>')
  await previewProcess.invoke('WebViewServer.start', id, port)

  const response = await get('http://localhost:3000')
  expect(response.status).toBe(200)
  expect(await response.text()).toBe('<h1>Hello World</h1>')

  previewProcess[Symbol.dispose]()
})
