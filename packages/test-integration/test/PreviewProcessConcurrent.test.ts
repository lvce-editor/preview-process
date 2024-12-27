import { expect, test } from '@jest/globals'
import getPort from 'get-port'
import { createPreviewProcess } from '../src/parts/CreatePreviewProcess/CreatePreviewProcess.js'
import { get } from '../src/parts/Get/Get.js'
import { getRoot } from '../src/parts/GetRoot/GetRoot.js'

test('preview process - handles concurrent requests', async () => {
  const previewProcess = createPreviewProcess()
  const id = 1
  const port = await getPort()
  const root = getRoot()

  await previewProcess.invoke('WebViewServer.create', id)
  await previewProcess.invoke('WebViewServer.setHandler', id, '', root, '', '')
  await previewProcess.invoke('WebViewServer.start', id, port)

  const requests = Array(50)
    .fill(null)
    .map(() => get(`http://localhost:${port}/package.json`))

  const responses = await Promise.all(requests)

  for (const response of responses) {
    expect(response.status).toBe(200)
  }

  previewProcess[Symbol.dispose]()
})
