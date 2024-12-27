import type { WebViewServer } from '../WebViewServerTypes/WebViewServerTypes.ts'
import * as GetFirstEvent from '../GetFirstEvent/GetFirstEvent.ts'

export const waitForServerToBeReady = async (server: WebViewServer, port: string): Promise<void> => {
  const responsePromise = await GetFirstEvent.getFirstEvent(server, {
    error: 1,
    listening: 2,
  })
  server.listen(port, () => {})
  const { type, event } = await responsePromise
  if (type === 1) {
    throw new Error(`Server error: ${event}`)
  }
}
