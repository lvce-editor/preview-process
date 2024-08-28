import { VError } from '@lvce-editor/verror'
import * as WaitForServerToBeReady from '../WaitForServerToBeReady/WaitForServerToBeReady.ts'
import * as WebViewServerState from '../WebViewServerState/WebViewServerState.ts'

export const startWebViewServer = async (id: number, port: number) => {
  try {
    const server = WebViewServerState.get(id)
    await WaitForServerToBeReady.waitForServerToBeReady(server, port)
  } catch (error) {
    throw new VError(error, 'Failed to start webview server')
  }
}
