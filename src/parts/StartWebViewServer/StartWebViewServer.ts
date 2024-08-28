import { createServer, IncomingMessage, ServerResponse } from 'node:http'
import { VError } from '@lvce-editor/verror'
import * as Promises from '../Promises/Promises.ts'

interface Handler {
  (req: IncomingMessage, res: ServerResponse): Promise<void>
}

export const startWebViewServer = async (id: number) => {
  try {
    const server = createServer()
    const { resolve, promise } = Promises.withResolvers()
    server.listen(port, resolve)
    await promise
    return {
      handler: undefined as any,
      setHandler(handleRequest: Handler) {
        if (this.handler) {
          return
        }
        this.handler = handleRequest
        server.on('request', handleRequest)
      },
    }
  } catch (error) {
    throw new VError(error, 'Failed to start webview server')
  }
}
