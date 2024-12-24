import { expect, test } from '@jest/globals'
import { createPreviewProcess } from '../src/parts/CreatePreviewProcess/CreatePreviewProcess.ts'
import { get } from '../src/parts/Get/Get.ts'
import { getPort } from '../src/parts/GetPort/GetPort.ts'

test('preview process - create and start server', async () => {
  const previewProcess = createPreviewProcess()
  const id = 1
  const port = await getPort()

  await previewProcess.invoke('WebViewServer.create', id)
  await previewProcess.invoke('WebViewServer.setInfo', id, 'test', '/test', '', '<h1>Hello World</h1>')
  await previewProcess.invoke('WebViewServer.setHandler', id, '', '/test', '', '<h1>Hello World</h1>')
  await previewProcess.invoke('WebViewServer.start', id, port.toString())

  const response = await get(`http://localhost:${port}`)
  expect(response.status).toBe(200)
  expect(await response.text()).toBe('<h1>Hello World</h1>')

  previewProcess[Symbol.dispose]()
})
