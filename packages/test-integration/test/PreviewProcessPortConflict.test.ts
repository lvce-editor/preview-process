import { expect, test } from '@jest/globals'
import getPort from 'get-port'
import { createPreviewProcess } from '../src/parts/CreatePreviewProcess/CreatePreviewProcess.js'

test('preview process - handles port already in use', async () => {
  const previewProcess1 = createPreviewProcess()
  const previewProcess2 = createPreviewProcess()
  const id1 = 1
  const id2 = 2
  const port = await getPort()

  await previewProcess1.invoke('WebViewServer.create', id1)
  await previewProcess1.invoke('WebViewServer.start', id1, port)

  await previewProcess2.invoke('WebViewServer.create', id2)
  await expect(previewProcess2.invoke('WebViewServer.start', id2, port)).rejects.toThrow(
    `Failed to start webview server: Server error: Error: listen EADDRINUSE: address already in use :::${port}`,
  )

  previewProcess1[Symbol.dispose]()
  previewProcess2[Symbol.dispose]()
})
