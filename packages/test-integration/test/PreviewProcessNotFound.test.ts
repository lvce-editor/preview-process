import { expect, test } from '@jest/globals'
import { createPreviewProcess } from '../src/parts/CreatePreviewProcess/CreatePreviewProcess.js'
import { get } from '../src/parts/Get/Get.js'

test('preview process - 404 for non-existent files', async () => {
  const previewProcess = createPreviewProcess()
  const id = 1
  const port = '3002'

  await previewProcess.invoke('WebViewServer.create', id)
  await previewProcess.invoke('WebViewServer.setInfo', id, 'test', process.cwd(), '', '')
  await previewProcess.invoke('WebViewServer.setHandler', id, '', process.cwd(), '', '')
  await previewProcess.invoke('WebViewServer.start', id, port)

  const response = await get('http://localhost:3002/non-existent-file.txt')
  expect(response.status).toBe(404)

  previewProcess[Symbol.dispose]()
})
