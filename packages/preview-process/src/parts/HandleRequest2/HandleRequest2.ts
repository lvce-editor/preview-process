import type { IncomingMessage, ServerResponse } from 'node:http'
import type { HandlerOptions } from '../HandlerOptions/HandlerOptions.ts'
import type { RequestOptions } from '../RequestOptions/RequestOptions.ts'
import * as GetInfoAndPath from '../GetInfoAndPath/GetInfoAndPath.ts'
import * as GetResponse from '../GetResponse/GetResponse.ts'
import { NotFoundResponse } from '../Responses/NotFoundResponse.ts'
import * as SendResponse from '../SendResponse/SendResponse.ts'

export const handleRequest2 = async (request: IncomingMessage, response: ServerResponse): Promise<void> => {
  const InfoAndPath = GetInfoAndPath.getInfoAndPath(request.url || '')

  if (!InfoAndPath) {
    const result = new NotFoundResponse()
    await SendResponse.sendResponse(response, result)
    return
  }

  const requestOptions: RequestOptions = {
    method: request.method || 'GET',
    path: InfoAndPath.pathname,
    headers: request.headers,
  }

  const handlerOptions: HandlerOptions = {
    webViewRoot: InfoAndPath.info.webViewRoot,
    contentSecurityPolicy: InfoAndPath.info.contentSecurityPolicy,
    iframeContent: InfoAndPath.info.iframeContent,
    stream: false,
    etag: true,

    // TODO remote path prefix needs to be registered independently of webViewInfo, since it applies to all webviews
    remotePathPrefix: '/remote',
  }

  const result = await GetResponse.getResponse(requestOptions, handlerOptions)
  await SendResponse.sendResponse(response, result)
}
