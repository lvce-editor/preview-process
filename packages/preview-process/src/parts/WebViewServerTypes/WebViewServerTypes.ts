import type { IncomingMessage, Server, ServerResponse } from 'node:http'

interface Handler {
  (req: IncomingMessage, res: ServerResponse): Promise<void>
}

export interface WebViewServer {
  handler: Handler | undefined
  readonly setHandler: (handler: Handler) => void
  readonly server: Server
  readonly listen: (port: string, callback: () => void) => void
  readonly on: (event: string, listener: any) => void
  readonly off: (event: string, listener: any) => void
}
