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
    // @ts-ignore
    await pipeline(result, response)
  }

  return handleRequest
}
