import { createReadStream } from 'node:fs'
import * as FileSystem from '../FileSystem/FileSystem.ts'
import * as GetContentType from '../GetContentType/GetContentType.ts'
import * as GetPathEtag from '../GetPathEtag/GetPathEtag.ts'
import * as HandleRangeRequest from '../HandleRangeRequest/HandleRangeRequest.ts'
import type { HandlerOptions } from '../HandlerOptions/HandlerOptions.ts'
import * as IsEnoentError from '../IsEnoentError/IsEnoentError.ts'
import * as MatchesEtag from '../MatchesEtag/MatchesEtag.ts'
import type { RequestOptions } from '../RequestOptions/RequestOptions.ts'
import { ContentResponse } from '../Responses/ContentResponse.ts'
import { NotFoundResponse } from '../Responses/NotFoundResponse.ts'
import { NotModifiedResponse } from '../Responses/NotModifiedResponse.ts'
import { ServerErrorResponse } from '../Responses/ServerErrorResponse.ts'

export const handleOther = async (
  filePath: string,
  requestOptions: RequestOptions,
  handlerOptions: HandlerOptions,
): Promise<Response> => {
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

    if (handlerOptions.stream) {
      const readStream = createReadStream(filePath)
      return new ContentResponse(readStream, contentType, etag)
    } else {
      const content = await FileSystem.readFile(filePath)
      return new ContentResponse(content, contentType, etag)
    }
  } catch (error) {
    if (IsEnoentError.isEnoentError(error)) {
      return new NotFoundResponse()
    }
    console.error(`[preview-server] ${error}`)
    return new ServerErrorResponse()
  }
}
