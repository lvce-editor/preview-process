import { expect, test } from '@jest/globals'
import getPort from 'get-port'
import { createPreviewProcess } from '../src/parts/CreatePreviewProcess/CreatePreviewProcess.js'
import { get } from '../src/parts/Get/Get.js'
import { getRoot } from '../src/parts/GetRoot/GetRoot.js'

test.skip('preview process - internal server error', async () => {
  const previewProcess = createPreviewProcess()
  const id = 1
  const port = await getPort()
  const root = getRoot()

  await previewProcess.invoke('WebViewServer.create', id)
  await previewProcess.invoke('WebViewServer.setHandler', id, '', root, '', '')
  await previewProcess.invoke('WebViewServer.start', id, port)

  // Using a special path that triggers internal server error in the preview process
  const response = await get(`http://localhost:${port}/__internal_error__`)
  expect(response.status).toBe(500)
  expect(await response.text()).toBe('500 - Internal Server Error')

  previewProcess[Symbol.dispose]()
})
