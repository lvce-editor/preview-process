import type { IncomingMessage, ServerResponse } from 'node:http'
import * as GetPathName from '../GetPathName/GetPathName.ts'
import * as GetResponse from '../GetResponse/GetResponse.ts'
import * as SendResponse from '../SendResponse/SendResponse.ts'
import * as GetResponseInfo from '../GetResponseInfo/GetResponseInfo.ts'

// TODO deprecated frame ancestors
export const createHandler = (
  frameAncestors: string,
  webViewRoot: string,
  contentSecurityPolicy: string,
  iframeContent: string,
) => {
  const handleRequest = async (request: IncomingMessage, response: ServerResponse): Promise<void> => {
    let pathName = GetPathName.getPathName(request)
    if (pathName === '/') {
      pathName += 'index.html'
    }
    const result = await GetResponse.getResponse(pathName, frameAncestors, webViewRoot, contentSecurityPolicy, iframeContent)
    await SendResponse.sendResponse(response, result)
  }

  return handleRequest
}
