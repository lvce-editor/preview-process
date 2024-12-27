import { expect, test } from '@jest/globals'
import getPort from 'get-port'
import { createPreviewProcess } from '../src/parts/CreatePreviewProcess/CreatePreviewProcess.js'
import { get } from '../src/parts/Get/Get.js'
import { getRoot } from '../src/parts/GetRoot/GetRoot.js'

test.skip('preview process - handles malformed URLs', async () => {
  const previewProcess = createPreviewProcess()
  const id = 1
  const port = await getPort()
  const root = getRoot()

  await previewProcess.invoke('WebViewServer.create', id)
  await previewProcess.invoke('WebViewServer.setHandler', id, '', root, '', '')
  await previewProcess.invoke('WebViewServer.start', id, port)

  const malformedUrls = [
    `http://localhost:${port}/%`,
    `http://localhost:${port}//`,
    `http://localhost:${port}/%00`,
    `http://localhost:${port}/../../../etc/passwd`,
    `http://localhost:${port}/%2e%2e%2f`,
  ]

  for (const url of malformedUrls) {
    const response = await get(url)
    expect(response.status).toBe(400)
  }

  previewProcess[Symbol.dispose]()
})
