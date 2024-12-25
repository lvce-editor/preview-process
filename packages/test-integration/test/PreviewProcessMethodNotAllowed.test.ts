import { expect, test } from '@jest/globals'
import getPort from 'get-port'
import { createPreviewProcess } from '../src/parts/CreatePreviewProcess/CreatePreviewProcess.js'
import { getRoot } from '../src/parts/GetRoot/GetRoot.js'

test('preview process - method not allowed', async () => {
  const previewProcess = createPreviewProcess()
  const id = 1
  const port = await getPort()
  const root = getRoot()

  await previewProcess.invoke('WebViewServer.create', id)
  await previewProcess.invoke('WebViewServer.setHandler', id, '', root, '', '')
  await previewProcess.invoke('WebViewServer.start', id, port)

  const response = await fetch(`http://localhost:${port}/package.json`, {
    method: 'POST',
  })

  expect(response.status).toBe(405) // Method Not Allowed

  previewProcess[Symbol.dispose]()
})
