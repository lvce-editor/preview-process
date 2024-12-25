import { createReadStream } from 'node:fs'
import type { RequestOptions } from '../RequestOptions/RequestOptions.ts'
import * as GetContentType from '../GetContentType/GetContentType.ts'
import * as GetPathEtag from '../GetPathEtag/GetPathEtag.ts'
import * as HandleRangeRequest from '../HandleRangeRequest/HandleRangeRequest.ts'
import * as IsEnoentError from '../IsEnoentError/IsEnoentError.ts'
import * as MatchesEtag from '../MatchesEtag/MatchesEtag.ts'
import { ContentResponse } from '../Responses/ContentResponse.ts'
import { NotFoundResponse } from '../Responses/NotFoundResponse.ts'
import { NotModifiedResponse } from '../Responses/NotModifiedResponse.ts'
import { ServerErrorResponse } from '../Responses/ServerErrorResponse.ts'

export const handleOther = async (filePath: string, requestOptions: RequestOptions): Promise<Response> => {
  try {
    if (requestOptions.range) {
      return await HandleRangeRequest.handleRangeRequest(filePath, requestOptions.range)
    }

    const etag = await GetPathEtag.getPathEtag(filePath)
    if (!etag) {
      return new NotFoundResponse()
    }

    if (MatchesEtag.matchesEtag(requestOptions, etag)) {
      return new NotModifiedResponse(etag)
    }

    const contentType = GetContentType.getContentType(filePath)
    const stream = createReadStream(filePath)
    return new ContentResponse(stream, contentType, etag)
  } catch (error) {
    if (IsEnoentError.isEnoentError(error)) {
      return new NotFoundResponse()
    }
    console.error(`[preview-server] ${error}`)
    return new ServerErrorResponse()
  }
}
