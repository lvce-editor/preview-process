import { expect, test } from '@jest/globals'
import getPort from 'get-port'
import { createPreviewProcess } from '../src/parts/CreatePreviewProcess/CreatePreviewProcess.js'
import { get } from '../src/parts/Get/Get.js'
import { getRoot } from '../src/parts/GetRoot/GetRoot.js'
import CDP from 'chrome-remote-interface'

test('preview process - internal server error', async () => {
  const debugPort = await getPort()
  const previewProcess = createPreviewProcess({
    execArgv: [`--inspect=${debugPort}`],
  })

  await new Promise((r) => {
    setTimeout(r, 1000)
  })

  const client = await CDP({
    host: 'localhost',
    port: Number(debugPort),
  })
  await client.Runtime.enable()

  // First compile the script
  const r1 = await client.Runtime.compileScript({
    expression: `(async ()=>{
      const fs = await import('node:fs/promises')
      throw new Error('hello from script')

    })()


    `,
    sourceURL: 'test.js',
    persistScript: true,
  })

  if (!r1.scriptId) {
    throw new Error(`Failed to compile script`)
  }

  // Then run it
  const r2 = await client.Runtime.runScript({
    scriptId: r1.scriptId,
    awaitPromise: true,
  })

  if (r2 && r2.result && r2.result.subtype === 'error') {
    throw new Error(r2.result.description)
  }

  console.log({ r2 })

  const id = 1
  const port = await getPort()
  const root = getRoot()

  await previewProcess.invoke('WebViewServer.create', id)
  await previewProcess.invoke('WebViewServer.setHandler', id, '', root, '', '')
  await previewProcess.invoke('WebViewServer.start', id, port)

  const response = await get(`http://localhost:${port}/any-file.txt`)
  expect(response.status).toBe(500)
  expect(await response.text()).toBe('[preview-server] Error: EACCES: permission denied')

  await client.close()
  previewProcess[Symbol.dispose]()
})
