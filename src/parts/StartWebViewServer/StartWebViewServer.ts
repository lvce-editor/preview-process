import { VError } from '@lvce-editor/verror'
import * as WaitForServerToBeReady from '../WaitForServerToBeReady/WaitForServerToBeReady.ts'
import * as WebViewServerState from '../WebViewServerState/WebViewServerState.ts'

export const startWebViewServer = async (id: number, port: string) => {
  try {
    const server = WebViewServerState.get(id)
    if (server.server.listening) {
      return
    }
    await WaitForServerToBeReady.waitForServerToBeReady(server, port)
  } catch (error) {
    throw new VError(error, 'Failed to start webview server')
  }
}
