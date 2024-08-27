import { pipeline } from 'node:stream/promises'
import * as GetPathName from '../GetPathName/GetPathName.ts'
import * as GetResponse from '../GetResponse/GetResponse.ts'

export const createHandler = (frameAncestors, webViewRoot) => {
  const handleRequest = async (request, response) => {
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
      return response.end('not found')
    }
    result.headers.forEach((value, key) => {
      response.setHeader(key, value)
    })
    await pipeline(result.body, response)
  }

  return handleRequest
}
