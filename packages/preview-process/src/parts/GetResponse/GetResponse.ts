import type { HandlerOptions } from '../HandlerOptions/HandlerOptions.ts'
import type { RequestOptions } from '../RequestOptions/RequestOptions.ts'
import * as FindMatchingRoute from '../FindMatchingRoute/FindMatchingRoute.ts'
import * as HttpHeader from '../HttpHeader/HttpHeader.ts'
import * as HttpMethod from '../HttpMethod/HttpMethod.ts'
import { HeadResponse } from '../Responses/HeadResponse.ts'
import { MethodNotAllowedResponse } from '../Responses/MethodNotAllowedResponse.ts'
import { NotFoundResponse } from '../Responses/NotFoundResponse.ts'
import { ServerErrorResponse } from '../Responses/ServerErrorResponse.ts'
import * as Routes from '../Routes/Routes.ts'

export const getResponse = async (request: RequestOptions, options: HandlerOptions): Promise<Response> => {
  const start = performance.now()

  try {
    if (request.method !== HttpMethod.Get && request.method !== HttpMethod.Head) {
      return new MethodNotAllowedResponse()
    }
    const matchedRoute = FindMatchingRoute.findMatchingRoute(request.path, Routes.routes)
    if (!matchedRoute) {
      return new NotFoundResponse()
    }
    const response = await matchedRoute.handler(request, options)
    if (request.method === HttpMethod.Head) {
      return new HeadResponse(response.status, response.headers)
    }

    // Add Server-Timing header
    const duration = Math.round(performance.now() - start)
    response.headers.set(HttpHeader.ServerTiming, `total;dur=${duration}`)

    return response
  } catch (error) {
    console.error(`[preview-process] ${error}`)
    return new ServerErrorResponse()
  }
}
