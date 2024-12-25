import { expect, test } from '@jest/globals'
import getPort from 'get-port'
import { createPreviewProcess } from '../src/parts/CreatePreviewProcess/CreatePreviewProcess.js'
import { getRoot } from '../src/parts/GetRoot/GetRoot.js'

test('preview process - handles HEAD requests', async () => {
  const previewProcess = createPreviewProcess()
  const id = 1
  const port = await getPort()
  const root = getRoot()

  await previewProcess.invoke('WebViewServer.create', id)
  await previewProcess.invoke('WebViewServer.setHandler', id, '', root, '', '')
  await previewProcess.invoke('WebViewServer.start', id, port)

  const response = await fetch(`http://localhost:${port}/package.json`, {
    method: 'HEAD',
  })

  expect(response.status).toBe(200)
  expect(response.headers.get('content-type')).toBe('application/json')
  expect(await response.text()).toBe('')

  previewProcess[Symbol.dispose]()
})
