import { test } from '@jest/globals'
import getPort from 'get-port'
import { createPreviewProcess } from '../src/parts/CreatePreviewProcess/CreatePreviewProcess.js'
import { get } from '../src/parts/Get/Get.js'
import * as WebSocket from '../src/parts/WebSocket/WebSocket.js'

test('preview process - internal server error', async () => {
  const debugPort = await getPort()
  // @ts-ignore
  const previewProcess = createPreviewProcess({
    execArgv: [`--inspect=${debugPort}`, '--experimental-strip-types'],
  })

  // Get WebSocket URL from Chrome DevTools Protocol
  const response = await get(`http://localhost:${debugPort}/json/list`)
  const data = await response.json()
  const wsUrl = data[0].webSocketDebuggerUrl

  // Connect to debug websocket
  const ws = await WebSocket.connect(wsUrl)

  // First compile the script
  await WebSocket.invoke(ws, 'Runtime.compileScript', {
    expression: `
      const fs = require('fs/promises');
      fs.readFile = () => {
        const error = new Error('EACCES: permission denied');
        error.code = 'EACCES';
        throw error;
      }
    `,
    sourceURL: 'test.js',
    persistScript: true,
    scriptId: 'my-script',
  })

  // Then run it
  const rr = await WebSocket.invoke(ws, 'Runtime.runScript', {
    scriptId: 'my-script',
    awaitPromise: true,
  })

  console.log({ rr })

  // const id = 1
  // const port = await getPort()
  // const root = getRoot()

  // await previewProcess.invoke('WebViewServer.create', id)
  // await previewProcess.invoke('WebViewServer.setHandler', id, '', root, '', '')
  // await previewProcess.invoke('WebViewServer.start', id, port)

  // const response2 = await get(`http://localhost:${port}/any-file.txt`)
  // expect(response2.status).toBe(500)
  // expect(await response2.text()).toBe('[preview-server] Error: EACCES: permission denied')

  // WebSocket.dispose(ws)
  // previewProcess[Symbol.dispose]()
})
