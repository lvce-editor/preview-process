import type { IncomingMessage, ServerResponse } from 'node:http'
import type { HandlerOptions } from '../HandlerOptions/HandlerOptions.ts'
import type { RequestOptions } from '../RequestOptions/RequestOptions.ts'
import * as GetInfoAndPath from '../GetInfoAndPath/GetInfoAndPath.ts'
import * as GetResponse from '../GetResponse/GetResponse.ts'
import { NotFoundResponse } from '../Responses/NotFoundResponse.ts'
import * as SendResponse from '../SendResponse/SendResponse.ts'

export const handleRequest2 = async (request: IncomingMessage, response: ServerResponse): Promise<void> => {
  const infoAndPath = GetInfoAndPath.getInfoAndPath(request.url || '')
  if (!infoAndPath) {
    const result = new NotFoundResponse()
    await SendResponse.sendResponse(response, result)
    return
  }
  const requestOptions: RequestOptions = {
    headers: request.headers,
    method: request.method || 'GET',
    path: infoAndPath.pathName,
  }
  const handlerOptions: HandlerOptions = {
    contentSecurityPolicy: infoAndPath.info.contentSecurityPolicy,
    etag: true,
    iframeContent: infoAndPath.info.iframeContent,
    remotePathPrefix: '/remote',
    stream: false,
    webViewRoot: infoAndPath.info.webViewRoot,
  }
  const result = await GetResponse.getResponse(requestOptions, handlerOptions)
  await SendResponse.sendResponse(response, result)
}
