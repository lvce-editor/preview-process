import type { IncomingMessage, ServerResponse } from 'node:http'
import { pipeline } from 'node:stream/promises'
import * as GetPathName from '../GetPathName/GetPathName.ts'
import * as GetResponse from '../GetResponse/GetResponse.ts'

export const createHandler = (frameAncestors: string, webViewRoot: string) => {
  const handleRequest = async (
    request: IncomingMessage,
    response: ServerResponse,
  ): Promise<void> => {
    let pathName = GetPathName.getPathName(request)
    if (pathName === '/') {
      pathName += 'index.html'
    }
    const result = await GetResponse.getResponse(
      pathName,
      frameAncestors,
      webViewRoot,
    )

    if (!result?.body) {
      response.end('not found')
      return
    }
    result.headers.forEach((value, key) => {
      response.setHeader(key, value)
    })
    await pipeline(result.body, response)
  }

  return handleRequest
}
