import type { WebViewServer } from '../WebViewServerTypes/WebViewServerTypes.ts'

interface FirstEvent {
  readonly type: string
  readonly event: any
}

export const waitForServerToBeReady = async (server: WebViewServer, port: string): Promise<void> => {
  const { resolve, reject, promise } = Promise.withResolvers<FirstEvent>()
  const handleError = (event: any) => {
    cleanup({
      type: 'error',
      event,
    })
  }
  const handleListening = (event: any): void => {
    cleanup({
      type: 'listening',
      event,
    })
  }
  const cleanup = (value: any): void => {
    server.off('listening', handleListening)
    server.off('error', handleError)
    resolve(value)
  }
  server.listen(port, () => {})
  const { type, event } = await promise
  if (type === 'error') {
    throw new Error(`server: ${event}`)
  }
}
