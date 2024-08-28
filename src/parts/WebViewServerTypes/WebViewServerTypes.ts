import type { IncomingMessage, ServerResponse } from 'node:http'

interface Handler {
  (req: IncomingMessage, res: ServerResponse): Promise<void>
}

export interface WebViewServer {
  handler: Handler | undefined
  readonly setHandler: (handler: Handler) => void
}
