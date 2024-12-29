import type { IncomingMessage, ServerResponse } from 'node:http'
import type { HandlerOptions } from '../HandlerOptions/HandlerOptions.ts'
import type { RequestOptions } from '../RequestOptions/RequestOptions.ts'
import * as GetInfoAndPath from '../GetInfoAndPath/GetInfoAndPath.ts'
import * as GetResponse from '../GetResponse/GetResponse.ts'
import * as HandlePreviewInjected from '../HandlePreviewInjected/HandlePreviewInjected.ts'
import { NotFoundResponse } from '../Responses/NotFoundResponse.ts'
import * as SendResponse from '../SendResponse/SendResponse.ts'

export const handleRequest2 = async (request: IncomingMessage, response: ServerResponse): Promise<void> => {
  if (request.url === '/js/preview-injected.js') {
    const result = await HandlePreviewInjected.handlePreviewInjected()
    await SendResponse.sendResponse(response, result)
    return
  }

  const infoAndPath = GetInfoAndPath.getInfoAndPath(request.url || '')

  if (!infoAndPath) {
    const result = new NotFoundResponse()
    await SendResponse.sendResponse(response, result)
    return
  }

  const requestOptions: RequestOptions = {
    method: request.method || 'GET',
    path: infoAndPath.pathName,
    headers: request.headers,
  }

  const handlerOptions: HandlerOptions = {
    webViewRoot: infoAndPath.info.webViewRoot,
    contentSecurityPolicy: infoAndPath.info.contentSecurityPolicy,
    iframeContent: infoAndPath.info.iframeContent,
    stream: false,
    etag: true,
    remotePathPrefix: '/remote',
  }

  const result = await GetResponse.getResponse(requestOptions, handlerOptions)
  await SendResponse.sendResponse(response, result)
}
