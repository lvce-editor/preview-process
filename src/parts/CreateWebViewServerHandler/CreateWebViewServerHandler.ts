import type { IncomingMessage, ServerResponse } from 'node:http'
import { fileURLToPath } from 'node:url'
import * as GetPathName from '../GetPathName/GetPathName.ts'
import * as GetResponse from '../GetResponse/GetResponse.ts'
import * as SendResponse from '../SendResponse/SendResponse.ts'

// TODO deprecated frame ancestors
export const createHandler = (webViewRoot: string, contentSecurityPolicy: string, iframeContent: string): any => {
  if (webViewRoot && webViewRoot.startsWith('file://')) {
    webViewRoot = fileURLToPath(webViewRoot)
  }
  const handleRequest = async (request: IncomingMessage, response: ServerResponse): Promise<void> => {
    let pathName = GetPathName.getPathName(request)
    if (pathName === '/') {
      pathName += 'index.html'
    }
    const range = request.headers.range
    const result = await GetResponse.getResponse(pathName, webViewRoot, contentSecurityPolicy, iframeContent, range)
    await SendResponse.sendResponse(response, result)
  }

  return handleRequest
}
