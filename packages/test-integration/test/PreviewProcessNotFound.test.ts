import { expect, test } from '@jest/globals'
import { createPreviewProcess } from '../src/parts/CreatePreviewProcess/CreatePreviewProcess.ts'
import { get } from '../src/parts/Get/Get.ts'
import { getPort } from '../src/parts/GetPort/GetPort.ts'

test('preview process - 404 for non-existent files', async () => {
  const previewProcess = createPreviewProcess()
  const id = 1
  const port = await getPort()
  const root = new URL('../../../', import.meta.url)

  await previewProcess.invoke('WebViewServer.create', id)
  await previewProcess.invoke('WebViewServer.setInfo', id, 'test', root, '', '')
  await previewProcess.invoke('WebViewServer.setHandler', id, '', root, '', '')
  await previewProcess.invoke('WebViewServer.start', id, port.toString())

  const response = await get(`http://localhost:${port}/non-existent-file.txt`)
  expect(response.status).toBe(404)

  previewProcess[Symbol.dispose]()
})
