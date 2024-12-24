import { expect, test } from '@jest/globals'
import getPort from 'get-port'
import { createPreviewProcess } from '../src/parts/CreatePreviewProcess/CreatePreviewProcess.js'
import { get } from '../src/parts/Get/Get.js'
import * as WebSocket from '../src/parts/WebSocket/WebSocket.js'

test('preview process - internal server error', async () => {
  const debugPort = await getPort()
  const previewProcess = createPreviewProcess({
    execArgv: [`--inspect=${debugPort}`, '--experimental-strip-types'],
  })

  // Get WebSocket URL from Chrome DevTools Protocol
  const response = await get(`http://localhost:${debugPort}/json/list`)
  const data = await response.json()
  const wsUrl = data[0].webSocketDebuggerUrl

  // Connect to debug websocket
  const ws = await WebSocket.connect(wsUrl)

  // Try to override fs.readFile
  await expect(
    WebSocket.invoke(ws, 'Runtime.evaluate', {
      expression: `
      import { promises as fs } from 'node:fs'
      fs.readFile = () => { throw new Error('Simulated internal error') }
    `,
    }),
  ).rejects.toThrow('Cannot use import statement outside a module')

  WebSocket.dispose(ws)
  previewProcess[Symbol.dispose]()
})
