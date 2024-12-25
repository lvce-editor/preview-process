import { expect, test } from '@jest/globals'
import getPort from 'get-port'
import { createPreviewProcess } from '../src/parts/CreatePreviewProcess/CreatePreviewProcess.js'
import { get } from '../src/parts/Get/Get.js'
import { getRoot } from '../src/parts/GetRoot/GetRoot.js'

test('preview process - handles range request beyond file size', async () => {
  const previewProcess = createPreviewProcess()
  const id = 1
  const port = await getPort()
  const root = getRoot()

  await previewProcess.invoke('WebViewServer.create', id)
  await previewProcess.invoke('WebViewServer.setHandler', id, '', root, '', '')
  await previewProcess.invoke('WebViewServer.start', id, port)

  const response = await get(`http://localhost:${port}/package.json`, {
    headers: {
      Range: 'bytes=100000-200000',
    },
  })

  expect(response.status).toBe(416) // Range Not Satisfiable
  expect(response.headers.get('Content-Range')).toMatch(/^bytes \*\/\d+$/)

  previewProcess[Symbol.dispose]()
})
