import { VError } from '@lvce-editor/verror'
import * as WaitForServerToBeReady from '../WaitForServerToBeReady/WaitForServerToBeReady.ts'
import * as WebViewServerState from '../WebViewServerState/WebViewServerState.ts'

export const startWebViewServer = async (id: number, port: string): Promise<void> => {
  try {
    const server = WebViewServerState.get(id)
    if (server.isListening()) {
      return
    }
    await WaitForServerToBeReady.waitForServerToBeReady(server, port)
  } catch (error) {
    throw new VError(error, 'Failed to start webview server')
  }
}
