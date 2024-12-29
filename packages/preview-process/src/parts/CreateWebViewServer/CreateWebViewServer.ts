import { VError } from '@lvce-editor/verror'
import { createServer } from 'node:http'
import type { WebViewServer } from '../WebViewServerTypes/WebViewServerTypes.ts'
import * as WebViewServerState from '../WebViewServerState/WebViewServerState.ts'
import * as HandleRequest2 from '../HandleRequest2/HandleRequest2.ts'

export const createWebViewServer = (id: number, useNewHandler?: boolean): void => {
  try {
    if (WebViewServerState.has(id)) {
      return
    }
    const server = createServer()
    if (useNewHandler) {
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      server.on('request', HandleRequest2.handleRequest2)
    }
    const webViewServer: WebViewServer = {
      handler: undefined,
      setHandler(handleRequest): void {
        if (this.handler) {
          return
        }
        this.handler = handleRequest
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        server.on('request', handleRequest)
      },
      on(event: string, listener: any): void {
        server.on(event, listener)
      },
      off(event: string, listener: any): void {
        server.off(event, listener)
      },
      listen(port, callback): void {
        server.listen(port, callback)
      },
      isListening(): boolean {
        return server.listening
      },
    }
    WebViewServerState.set(id, webViewServer)
  } catch (error) {
    throw new VError(error, 'Failed to create webview server')
  }
}
