import type { IncomingMessage, ServerResponse } from 'node:http'
import { fileURLToPath } from 'node:url'
import type { HandlerOptions } from '../HandlerOptions/HandlerOptions.ts'
import type { RequestOptions } from '../RequestOptions/RequestOptions.ts'
import * as GetPathName from '../GetPathName/GetPathName.ts'
import * as GetResponse from '../GetResponse/GetResponse.ts'
import * as SendResponse from '../SendResponse/SendResponse.ts'

export const createHandler = (webViewRoot: string, contentSecurityPolicy: string, iframeContent: string): any => {
  if (webViewRoot && webViewRoot.startsWith('file://')) {
    webViewRoot = fileURLToPath(webViewRoot)
  }
  const handleRequest = async (request: IncomingMessage, response: ServerResponse): Promise<void> => {
    let pathName = GetPathName.getPathName(request)
    if (pathName === '/') {
      pathName += 'index.html'
    }

    const requestOptions: RequestOptions = {
      method: request.method || 'GET',
      range: request.headers.range,
      path: pathName,
    }

    const handlerOptions: HandlerOptions = {
      webViewRoot,
      contentSecurityPolicy,
      iframeContent,
    }

    const result = await GetResponse.getResponse(requestOptions, handlerOptions)
    await SendResponse.sendResponse(response, result)
  }

  return handleRequest
}
