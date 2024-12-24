import { expect, test } from '@jest/globals'
import getPort from 'get-port'
import { createPreviewProcess } from '../src/parts/CreatePreviewProcess/CreatePreviewProcess.js'
import { get } from '../src/parts/Get/Get.js'
import * as WebSocket from '../src/parts/WebSocket/WebSocket.js'
import { getRoot } from '../src/parts/GetRoot/GetRoot.js'

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

  // Override fs.readFile to simulate EACCES error
  await WebSocket.invoke(ws, 'Runtime.evaluate', {
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
  })

  const id = 1
  const port = await getPort()
  const root = getRoot()

  await previewProcess.invoke('WebViewServer.create', id)
  await previewProcess.invoke('WebViewServer.setHandler', id, '', root, '', '')
  await previewProcess.invoke('WebViewServer.start', id, port)

  const response2 = await get(`http://localhost:${port}/any-file.txt`)
  expect(response2.status).toBe(500)
  expect(await response2.text()).toBe('[preview-server] Error: EACCES: permission denied')

  WebSocket.dispose(ws)
  previewProcess[Symbol.dispose]()
})
