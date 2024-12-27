import { expect, test } from '@jest/globals'
import getPort from 'get-port'
import { createPreviewProcess } from '../src/parts/CreatePreviewProcess/CreatePreviewProcess.ts'

test('preview process - handles port already in use', async () => {
  const previewProcess1 = createPreviewProcess()
  const id = 1
  const port = await getPort()
  // TODO improve error message
  await expect(previewProcess1.invoke('WebViewServer.start', id, port)).rejects.toThrow(
    'Failed to start webview server: Server with id 1 not found',
  )
  previewProcess1[Symbol.dispose]()
})
