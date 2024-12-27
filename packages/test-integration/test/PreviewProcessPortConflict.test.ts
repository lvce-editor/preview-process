import { expect, test } from '@jest/globals'
import getPort from 'get-port'
import { createPreviewProcess } from '../src/parts/CreatePreviewProcess/CreatePreviewProcess.js'

test('preview process - handles port already in use', async () => {
  const previewProcess1 = createPreviewProcess()
  const previewProcess2 = createPreviewProcess()
  const id = 1
  const port = await getPort()

  await previewProcess1.invoke('WebViewServer.create', id)
  await previewProcess1.invoke('WebViewServer.start', id, port)

  // TODO improve error message
  await expect(previewProcess2.invoke('WebViewServer.start', id, port)).rejects.toThrow(
    "Failed to start webview server: TypeError: Cannot read properties of undefined (reading 'server')",
  )

  previewProcess1[Symbol.dispose]()
  previewProcess2[Symbol.dispose]()
})
