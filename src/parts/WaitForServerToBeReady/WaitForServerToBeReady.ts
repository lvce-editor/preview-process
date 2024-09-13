import * as Promises from '../Promises/Promises.ts'
import { WebViewServer } from '../WebViewServerTypes/WebViewServerTypes.ts'

export const waitForServerToBeReady = async (server: WebViewServer, port: string) => {
  const { resolve, promise } = Promises.withResolvers<void>()
  server.listen(port, resolve)
  await promise
}
