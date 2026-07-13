import type { IncomingMessage, ServerResponse } from 'node:http'

interface Handler {
  (req: IncomingMessage, res: ServerResponse): Promise<void>
}

export interface WebViewServer {
  handler: Handler | undefined
  readonly isListening: () => boolean
  readonly listen: (port: string, callback: () => void) => void
  readonly off: (event: string, listener: any) => void
  readonly on: (event: string, listener: any) => void
  readonly setHandler: (handler: Handler) => void
}
