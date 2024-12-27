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
  // TODO configuration can be added via setInfo. then the request handler doesn't need to be a closure,
  // but instead can retrieve the info from infoState (matching by request protocol / request url)
  const handleRequest = async (request: IncomingMessage, response: ServerResponse): Promise<void> => {
    let pathName = GetPathName.getPathName(request)
    if (pathName === '/') {
      pathName += 'index.html'
    }

    const requestOptions: RequestOptions = {
      method: request.method || 'GET',
      path: pathName,
      headers: request.headers,
    }

    const handlerOptions: HandlerOptions = {
      webViewRoot,
      contentSecurityPolicy,
      iframeContent,
      stream: false,
      etag: true,
    }

    const result = await GetResponse.getResponse(requestOptions, handlerOptions)
    await SendResponse.sendResponse(response, result)
  }

  return handleRequest
}
