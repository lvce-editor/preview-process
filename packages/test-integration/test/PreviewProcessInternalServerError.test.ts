import { expect, test } from '@jest/globals'
import getPort from 'get-port'
import { createPreviewProcess } from '../src/parts/CreatePreviewProcess/CreatePreviewProcess.js'
import { get } from '../src/parts/Get/Get.js'
import { getRoot } from '../src/parts/GetRoot/GetRoot.js'
import { WebSocket } from 'ws'

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
  const ws = new WebSocket(wsUrl)
  await new Promise((resolve) => ws.once('open', resolve))

  // Send runtime.evaluate to override fs.readFile
  const r = await new Promise((resolve) => {
    ws.send(
      JSON.stringify({
        id: 1,
        method: 'Runtime.evaluate',
        params: {
          expression: `
          import { promises as fs } from 'node:fs'
          fs.readFile = () => { throw new Error('Simulated internal error') }
        `,
        },
      }),
    )
    ws.once('message', resolve)
  })
  // @ts-ignore
  console.log({ r: r.toString() })

  const id = 1
  const port = await getPort()
  const root = getRoot()

  await previewProcess.invoke('WebViewServer.create', id)
  await previewProcess.invoke('WebViewServer.setHandler', id, '', root, '', '')
  await previewProcess.invoke('WebViewServer.start', id, port)

  const response2 = await get(`http://localhost:${port}/any-file.txt`)
  expect(response2.status).toBe(500)
  expect(await response2.text()).toBe('[preview-server] Error: Simulated internal error')

  ws.close()
  previewProcess[Symbol.dispose]()
})
