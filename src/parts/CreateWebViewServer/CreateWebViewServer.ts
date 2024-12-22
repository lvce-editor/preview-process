import { VError } from '@lvce-editor/verror'
import { createServer } from 'node:http'
import type { WebViewServer } from '../WebViewServerTypes/WebViewServerTypes.ts'
import * as WebViewServerState from '../WebViewServerState/WebViewServerState.ts'

export const createWebViewServer = (id: number): void => {
  try {
    if (WebViewServerState.has(id)) {
      return
    }
    const server = createServer()
    const webViewServer: WebViewServer = {
      server,
      handler: undefined,
      setHandler(handleRequest): void {
        if (this.handler) {
          return
        }
        this.handler = handleRequest
        this.server.on('request', handleRequest)
      },
      listen(port, callback): void {
        this.server.listen(port, callback)
      },
    }
    WebViewServerState.set(id, webViewServer)
  } catch (error) {
    throw new VError(error, 'Failed to create webview server')
  }
}
