import * as GetHeaders from '../GetHeaders/GetHeaders.js'
import * as GetPathEtag from '../GetPathEtag/GetPathEtag.ts'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.ts'
import * as MatchesEtag from '../MatchesEtag/MatchesEtag.ts'
import * as NotFoundResponse from '../NotFoundResponse/NotFoundResponse.ts'
import * as NotModifiedResponse from '../NotModifiedResponse/NotModifiedResponse.ts'

export const getResponseInfo = async (request: any, absolutePath: string) => {
  const etag = await GetPathEtag.getPathEtag(absolutePath)
  if (!etag) {
    return NotFoundResponse.notFoundResponse
  }
  if (MatchesEtag.matchesEtag(request, etag)) {
    return NotModifiedResponse.notModifiedResponse
  }
  const headers = GetHeaders.getHeaders(absolutePath, etag)
  return {
    absolutePath,
    status: HttpStatusCode.Ok,
    headers,
  }
}
