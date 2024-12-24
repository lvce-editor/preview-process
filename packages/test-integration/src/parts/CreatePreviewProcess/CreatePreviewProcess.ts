import { fork } from 'node:child_process'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const PREVIEW_PROCESS_PATH = join(__dirname, '../../../../preview-process/src/previewProcessMain.ts')

export interface PreviewProcess {
  readonly invoke: (method: string, ...params: unknown[]) => Promise<unknown>
  readonly [Symbol.dispose]: () => void
}

export const createPreviewProcess = (options: { execArgv?: string[] } = {}): PreviewProcess => {
  const childProcess = fork(PREVIEW_PROCESS_PATH, ['--ipc-type=node-forked-process'], {
    execArgv: options.execArgv || ['--experimental-strip-types'],
  })
  return {
    async invoke(method: string, ...params: any[]): Promise<void> {
      const { promise, resolve } = Promise.withResolvers<any>()
      const messageId = Math.random()
      const listener = (message: any): void => {
        if (message.id === messageId) {
          childProcess.off('message', listener)
          resolve(message)
        }
      }
      childProcess.on('message', listener)
      childProcess.send({
        jsonrpc: '2.0',
        id: messageId,
        method,
        params,
      })
      const response = await promise
      if (response.error) {
        throw new Error(response.error.message)
      }
      return response.result
    },
    [Symbol.dispose](): void {
      childProcess.kill()
    },
  }
}
