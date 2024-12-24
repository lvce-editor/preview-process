import { expect, test } from '@jest/globals'
import getPort from 'get-port'
import { createPreviewProcess } from '../src/parts/CreatePreviewProcess/CreatePreviewProcess.js'
import { get } from '../src/parts/Get/Get.js'

test('preview process - serve static files', async () => {
  const previewProcess = createPreviewProcess()
  const id = 1
  const port = await getPort()
  const root = new URL('../../../', import.meta.url)

  await previewProcess.invoke('WebViewServer.create', id)
  await previewProcess.invoke('WebViewServer.setHandler', id, '', root, '', '')
  await previewProcess.invoke('WebViewServer.start', id, port)

  const response = await get(`http://localhost:${port}/package.json`)
  expect(response.status).toBe(200)
  expect(response.headers.get('content-type')).toBe('application/json')

  const json = await response.json()
  expect(json).toHaveProperty('name')

  previewProcess[Symbol.dispose]()
})
