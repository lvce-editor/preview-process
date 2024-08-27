import { createServer } from 'node:http'
import { VError } from '@lvce-editor/verror'
import * as Promises from '../Promises/Promises.ts'

export const createWebViewServer = async (port) => {
  try {
    const server = createServer()
    const { resolve, promise } = Promises.withResolvers()
    server.listen(port, resolve)
    await promise
    return {
      handler: undefined,
      setHandler(handleRequest) {
        if (this.handler) {
          return
        }

        this.handler = this.handler
        server.on('request', handleRequest)
      },
    }
  } catch (error) {
    throw new VError(error, 'Failed to start webview server')
  }
}