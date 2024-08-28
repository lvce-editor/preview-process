import { VError } from '@lvce-editor/verror'
import * as Promises from '../Promises/Promises.ts'
import * as WebViewServerState from '../WebViewServerState/WebViewServerState.ts'

export const startWebViewServer = async (id: number, port: number) => {
  try {
    const server = WebViewServerState.get(id)
    const { resolve, promise } = Promises.withResolvers()
    server.listen(port, resolve)
    await promise
  } catch (error) {
    throw new VError(error, 'Failed to start webview server')
  }
}
