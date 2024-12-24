import { expect, test } from '@jest/globals'
import { fork } from 'node:child_process'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const PREVIEW_PROCESS_PATH = join(__dirname, '../../preview-process/src/previewProcessMain.ts')

interface PreviewProcess {
  readonly send: (method: string, ...params: unknown[]) => Promise<unknown>
  readonly dispose: () => void
}

const createPreviewProcess = (): PreviewProcess => {
  const childProcess = fork(PREVIEW_PROCESS_PATH, ['--ipc-type=node-forked-process'], {
    execArgv: ['--experimental-strip-types'],
  })
  return {
    async send(method: string, ...params: any[]): Promise<void> {
      const { promise, resolve } = Promise.withResolvers<any>()
      const messageId = Math.random()
      const listener = (message: any): void => {
        if (message.id === messageId) {
          childProcess.off('message', listener)
          resolve(message.result)
        }
      }
      childProcess.on('message', listener)
      childProcess.send({
        jsonrpc: '2.0',
        id: messageId,
        method,
        params,
      })
      return promise
    },
    dispose(): void {
      childProcess.kill()
    },
  }
}

const get = async (url: string): Promise<any> => {
  const response = await fetch(url)
  return response
}

test('preview process - create and start server', async () => {
  const previewProcess = createPreviewProcess()
  const id = 1
  const port = '3000'

  // Create server
  await previewProcess.send('WebViewServer.create', id)

  // Set server info
  await previewProcess.send('WebViewServer.setInfo', id, 'test', '/test', '', '<h1>Hello World</h1>')

  // Set handler
  await previewProcess.send('WebViewServer.setHandler', id, '', '/test', '', '<h1>Hello World</h1>')

  // Start server
  await previewProcess.send('WebViewServer.start', id, port)

  // Make request to server
  const response = await get('http://localhost:3000')
  expect(response.status).toBe(200)
  expect(await response.text()).toBe('<h1>Hello World</h1>')

  previewProcess.dispose()
})

test('preview process - serve static files', async () => {
  const previewProcess = createPreviewProcess()
  const id = 1
  const port = '3001'

  await previewProcess.send('WebViewServer.create', id)
  await previewProcess.send('WebViewServer.setInfo', id, 'test', process.cwd(), '', '')
  await previewProcess.send('WebViewServer.setHandler', id, '', process.cwd(), '', '')
  await previewProcess.send('WebViewServer.start', id, port)

  const response = await get('http://localhost:3001/package.json')
  expect(response.status).toBe(200)
  expect(response.headers.get('content-type')).toBe('application/json')

  const json = await response.json()
  expect(json).toHaveProperty('name')

  previewProcess.dispose()
})

test('preview process - 404 for non-existent files', async () => {
  const previewProcess = createPreviewProcess()
  const id = 1
  const port = '3002'

  await previewProcess.send('WebViewServer.create', id)
  await previewProcess.send('WebViewServer.setInfo', id, 'test', process.cwd(), '', '')
  await previewProcess.send('WebViewServer.setHandler', id, '', process.cwd(), '', '')
  await previewProcess.send('WebViewServer.start', id, port)

  const response = await get('http://localhost:3002/non-existent-file.txt')
  expect(response.status).toBe(404)

  previewProcess.dispose()
})
