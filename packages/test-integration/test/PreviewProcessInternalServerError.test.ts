import { expect, test } from '@jest/globals'
import getPort from 'get-port'
import { connectToCdp } from '../src/parts/ConnectToCdp/ConnectToCdp.ts'
import { createPreviewProcess } from '../src/parts/CreatePreviewProcess/CreatePreviewProcess.js'
import { get } from '../src/parts/Get/Get.js'
import { getRoot } from '../src/parts/GetRoot/GetRoot.js'

test('preview process - internal server error', async () => {
  const debugPort = await getPort()
  const ajs = new URL('./a.js', import.meta.url).toString()

  const previewProcess = createPreviewProcess({
    execArgv: [`--inspect-brk=${debugPort}`, '--experimental-vm-modules', '--experimental-strip-types', `--import=${ajs}`],
  })

  const client = await connectToCdp(debugPort)
  await client.Debugger.enable()
  await client.Runtime.enable()
  await client.Runtime.evaluate({
    expression: 'typeof require',
  })
  // console.log({ r12 })
  await client.Runtime.runIfWaitingForDebugger()

  const global = await client.Runtime.evaluate({
    expression: 'globalThis',
  })
  const filePath = ''
  await client.Runtime.callFunctionOn({
    objectId: global.result.objectId,
    functionDeclaration: `function(moduleName, key, arg0, errorMessage, errorCode){
  const global = this
  global.mockModule(moduleName, key, arg0, errorMessage, errorCode)
}`,
    arguments: [
      {
        value: 'node:fs/promises',
      },
      {
        value: 'readFile',
      },
      {
        value: filePath,
      },
      {
        value: 'Access Denied',
      },
      {
        value: 'EACCES',
      },
    ],
  })

  const id = 1
  const port = await getPort()
  const root = getRoot()

  await previewProcess.invoke('WebViewServer.create', id)
  await previewProcess.invoke('WebViewServer.setHandler', id, '', root, '', '')
  await previewProcess.invoke('WebViewServer.start', id, port)

  const response = await get(`http://localhost:${port}/any-file.txt`)
  expect(response.status).toBe(500)
  expect(await response.text()).toBe('Internal Server Error')

  await client.close()
  previewProcess[Symbol.dispose]()
})
