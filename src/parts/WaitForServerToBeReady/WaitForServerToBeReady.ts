import { WebViewServer } from '../WebViewServerTypes/WebViewServerTypes.ts'

export const waitForServerToBeReady = async (server: WebViewServer, port: string): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  const { resolve, promise } = Promise.withResolvers<void>()
  server.listen(port, resolve)
  await promise
}
