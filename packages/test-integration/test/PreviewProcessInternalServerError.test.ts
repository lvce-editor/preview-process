import { expect, test } from '@jest/globals'
import getPort from 'get-port'
import { createPreviewProcess } from '../src/parts/CreatePreviewProcess/CreatePreviewProcess.js'
import { get } from '../src/parts/Get/Get.js'
import { getRoot } from '../src/parts/GetRoot/GetRoot.js'

test('preview process - internal server error', async () => {
  const debugPort = await getPort()
  const previewProcess = createPreviewProcess({
    execArgv: [`--inspect=${debugPort}`, '--experimental-strip-types'],
  })

  // await new Promise((r) => {
  //   setTimeout(r, 1000)
  // })

  // const client = await CDP({
  //   host: 'localhost',
  //   port: Number(debugPort),
  // })
  // await client.Runtime.enable()

  const r = await previewProcess.invoke('Test.mockFs')
  console.log({ r })

  const id = 1
  const port = await getPort()
  const root = getRoot()

  await previewProcess.invoke('WebViewServer.create', id)
  await previewProcess.invoke('WebViewServer.setHandler', id, '', root, '', '')
  await previewProcess.invoke('WebViewServer.start', id, port)

  const response = await get(`http://localhost:${port}/any-file.txt`)
  expect(response.status).toBe(500)
  expect(await response.text()).toBe('[preview-server] Error: EACCES: permission denied')

  // await client.close()
  previewProcess[Symbol.dispose]()
})
