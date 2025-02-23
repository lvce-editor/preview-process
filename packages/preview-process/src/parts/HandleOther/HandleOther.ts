import { createReadStream } from 'node:fs'
import type { HandlerOptions } from '../HandlerOptions/HandlerOptions.ts'
import type { RequestOptions } from '../RequestOptions/RequestOptions.ts'
import * as FileSystem from '../FileSystem/FileSystem.ts'
import * as GetContentType from '../GetContentType/GetContentType.ts'
import * as GetPathEtag from '../GetPathEtag/GetPathEtag.ts'
import * as HandleRangeRequest from '../HandleRangeRequest/HandleRangeRequest.ts'
import * as IsEnoentError from '../IsEnoentError/IsEnoentError.ts'
import * as IsUriError from '../IsUriError/IsUriError.ts'
import * as MatchesEtag from '../MatchesEtag/MatchesEtag.ts'
import * as ResolveFilePath from '../ResolveFilePath/ResolveFilePath.ts'
import { BadRequestResponse } from '../Responses/BadRequestResponse.ts'
import { ContentResponse } from '../Responses/ContentResponse.ts'
import { NotFoundResponse } from '../Responses/NotFoundResponse.ts'
import { NotModifiedResponse } from '../Responses/NotModifiedResponse.ts'
import { ServerErrorResponse } from '../Responses/ServerErrorResponse.ts'

export const handleOther = async (requestOptions: RequestOptions, handlerOptions: HandlerOptions): Promise<Response> => {
  try {
    const filePath = ResolveFilePath.resolveFilePath(requestOptions.path, handlerOptions.webViewRoot)
    if (requestOptions.headers && requestOptions.headers.range) {
      return await HandleRangeRequest.handleRangeRequest(filePath, requestOptions.headers.range)
    }

    const etag = handlerOptions.etag ? await GetPathEtag.getPathEtag(filePath) : undefined
    if (etag === null) {
      return new NotFoundResponse()
    }

    if (etag && MatchesEtag.matchesEtag(requestOptions, etag)) {
      return new NotModifiedResponse(etag)
    }

    const contentType = GetContentType.getContentType(filePath)

    if (handlerOptions.stream) {
      const readStream = createReadStream(filePath)
      return new ContentResponse(readStream, contentType, etag)
    }
    const content = await FileSystem.readFile(filePath)
    return new ContentResponse(content, contentType, etag)
  } catch (error) {
    if (IsEnoentError.isEnoentError(error)) {
      return new NotFoundResponse()
    }
    if (IsUriError.isUriError(error)) {
      return new BadRequestResponse()
    }
    console.error(`[preview-server] ${error}`)
    return new ServerErrorResponse()
  }
}
