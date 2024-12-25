import { expect, test } from '@jest/globals'
import getPort from 'get-port'
import { fileURLToPath } from 'url'
import { connectToCdp } from '../src/parts/ConnectToCdp/ConnectToCdp.ts'
import { createPreviewProcess } from '../src/parts/CreatePreviewProcess/CreatePreviewProcess.js'
import { get } from '../src/parts/Get/Get.js'
import { getRoot } from '../src/parts/GetRoot/GetRoot.js'
import { mockModule } from '../src/parts/MockModule/MockModule.js'

test('preview process - internal server error', async () => {
  const debugPort = await getPort()
  const ajs = new URL('../src/a.js', import.meta.url).toString()
  const root = getRoot()
  const rootPath = fileURLToPath(root)
  // TODO file path has duplicate slash for some reason, it should only have one slash or backslash.
  const slash = process.platform === 'win32' ? '\\' : '/'
  const filePath = `${rootPath}${slash}any-file.txt`
  const previewProcess = createPreviewProcess({
    execArgv: [`--inspect=localhost:${debugPort}`, '--experimental-strip-types', `--import=${ajs}`],
  })

  const client = await connectToCdp(debugPort)

  await mockModule(client.Runtime, {
    moduleName: 'node:fs/promises',
    functionName: 'readFile',
    filePath,
    errorMessage: 'Access Denied',
    errorCode: 'EACCES',
  })

  const id = 1
  const port = await getPort()

  await previewProcess.invoke('WebViewServer.create', id)
  await previewProcess.invoke('WebViewServer.setHandler', id, '', root, '', '')
  await previewProcess.invoke('WebViewServer.start', id, port)

  const response = await get(`http://localhost:${port}/any-file.txt`)
  expect(response.status).toBe(500)
  expect(await response.text()).toBe('Internal Server Error')

  await client[Symbol.dispose]()
  previewProcess[Symbol.dispose]()
})
