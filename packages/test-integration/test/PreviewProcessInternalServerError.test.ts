import { expect, test } from '@jest/globals'
import getPort from 'get-port'
import { createPreviewProcess } from '../src/parts/CreatePreviewProcess/CreatePreviewProcess.js'
import { get } from '../src/parts/Get/Get.js'
import { getRoot } from '../src/parts/GetRoot/GetRoot.js'
import CDP from 'chrome-remote-interface'

test('preview process - internal server error', async () => {
  const debugPort = await getPort()
  const previewProcess = createPreviewProcess({
    execArgv: [`--inspect=${debugPort}`, '--experimental-vm-modules', '--experimental-strip-types'],
  })

  await new Promise((r) => {
    setTimeout(r, 1000)
  })

  const client = await CDP({
    host: 'localhost',
    port: Number(debugPort),
  })
  await client.Runtime.enable()

  await client.Runtime.evaluate({
    expression: `
      (async () => {
        const fs = await import('node:fs/promises')
        const originalReadFile = fs.readFile
        fs.readFile = () => {
          const error = new Error('EACCES: permission denied')
          error.code = 'EACCES'
          throw error
        }
      })()
    `,
    awaitPromise: true,
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
