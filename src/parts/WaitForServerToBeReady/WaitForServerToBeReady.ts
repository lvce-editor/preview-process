import { WebViewServer } from '../WebViewServerTypes/WebViewServerTypes.ts'

export const waitForServerToBeReady = async (server: WebViewServer, port: string): Promise<void> => {
  const { resolve, promise } = Promise.withResolvers<void>()
  server.listen(port, resolve)
  await promise
}
