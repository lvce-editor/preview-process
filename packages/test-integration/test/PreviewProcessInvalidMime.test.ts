import { expect, test } from '@jest/globals'
import getPort from 'get-port'
import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import { createPreviewProcess } from '../src/parts/CreatePreviewProcess/CreatePreviewProcess.js'
import { get } from '../src/parts/Get/Get.js'
import { getRoot } from '../src/parts/GetRoot/GetRoot.js'

test.skip('preview process - handles unknown file types', async () => {
  const previewProcess = createPreviewProcess()
  const id = 1
  const port = await getPort()
  const root = getRoot()

  const testPath = path.join(root, 'test.unknown')
  await fs.writeFile(testPath, 'test content')

  await previewProcess.invoke('WebViewServer.create', id)
  await previewProcess.invoke('WebViewServer.setHandler', id, '', root, '', '')
  await previewProcess.invoke('WebViewServer.start', id, port)

  const response = await get(`http://localhost:${port}/test.unknown`)
  expect(response.status).toBe(200)
  expect(response.headers.get('Content-Type')).toBe('application/octet-stream')

  await fs.unlink(testPath)
  previewProcess[Symbol.dispose]()
})
