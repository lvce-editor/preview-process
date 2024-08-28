import { VError } from '@lvce-editor/verror'
import { createServer } from 'node:http'
import * as WebViewServerState from '../WebViewServerState/WebViewServerState.ts'
import type { WebViewServer } from '../WebViewServerTypes/WebViewServerTypes.ts'

export const createWebViewServer = (id: number): void => {
  try {
    const server = createServer()
    const webViewServer: WebViewServer = {
      handler: undefined,
      setHandler(handleRequest) {
        if (this.handler) {
          return
        }
        this.handler = handleRequest
        server.on('request', handleRequest)
      },
    }
    WebViewServerState.set(id, webViewServer)
  } catch (error) {
    throw new VError(error, 'Failed to create webview server')
  }
}
