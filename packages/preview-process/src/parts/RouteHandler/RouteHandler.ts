import type { HandlerOptions } from '../HandlerOptions/HandlerOptions.ts'
import type { RequestOptions } from '../RequestOptions/RequestOptions.ts'

export interface RouteHandler {
  readonly pattern: RegExp | string
  readonly handler: (request: RequestOptions, options: HandlerOptions) => Promise<Response>
}
