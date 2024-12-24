import { expect, test } from '@jest/globals'
import getPort from 'get-port'
import { createPreviewProcess } from '../src/parts/CreatePreviewProcess/CreatePreviewProcess.js'
import { get } from '../src/parts/Get/Get.js'
import { getRoot } from '../src/parts/GetRoot/GetRoot.js'
import { fileURLToPath } from 'url'

test('preview process - internal server error', async () => {
  const debugPort = await getPort()
  const previewProcess = createPreviewProcess({
    execArgv: [`--inspect=${debugPort}`, '--experimental-strip-types'],
  })

  const root = getRoot()
  const rootPath = fileURLToPath(root)
  const filePath = `${rootPath}/any-file.txt`

  await previewProcess.invoke('Test.mockFs', 'node:fs/promises', 'readFile', filePath, 'Access Denied', 'EACCES')

  const id = 1
  const port = await getPort()

  await previewProcess.invoke('WebViewServer.create', id)
  await previewProcess.invoke('WebViewServer.setHandler', id, '', root, '', '')
  await previewProcess.invoke('WebViewServer.start', id, port)

  const response = await get(`http://localhost:${port}/any-file.txt`)
  expect(response.status).toBe(500)
  expect(await response.text()).toBe('[preview-server] Error: EACCES: permission denied')

  // await client.close()
  previewProcess[Symbol.dispose]()
})
