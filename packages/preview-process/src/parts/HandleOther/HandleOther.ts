import * as FileSystem from '../FileSystem/FileSystem.ts'
import * as GetContentType from '../GetContentType/GetContentType.ts'
import * as HandleRangeRequest from '../HandleRangeRequest/HandleRangeRequest.ts'
import * as HttpHeader from '../HttpHeader/HttpHeader.ts'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.ts'
import * as IsEnoentError from '../IsEnoentError/IsEnoentError.ts'
import * as GetPathEtag from '../GetPathEtag/GetPathEtag.ts'
import * as MatchesEtag from '../MatchesEtag/MatchesEtag.ts'
import { RequestOptions } from '../RequestOptions/RequestOptions.ts'

export const handleOther = async (filePath: string, request: RequestOptions): Promise<Response> => {
  try {
    if (request.range) {
      return await HandleRangeRequest.handleRangeRequest(filePath, request.range)
    }

    const etag = await GetPathEtag.getPathEtag(filePath)
    if (!etag) {
      return new Response('not found', {
        status: HttpStatusCode.NotFound,
        headers: {
          [HttpHeader.CrossOriginResourcePolicy]: 'same-origin',
        },
      })
    }

    if (request && MatchesEtag.matchesEtag(request, etag)) {
      return new Response(null, {
        status: HttpStatusCode.NotModified,
        headers: {
          [HttpHeader.CrossOriginResourcePolicy]: 'same-origin',
          [HttpHeader.Etag]: etag,
        },
      })
    }

    const contentType = GetContentType.getContentType(filePath)
    const content = await FileSystem.readFile(filePath)
    return new Response(content, {
      headers: {
        [HttpHeader.CrossOriginResourcePolicy]: 'same-origin',
        [HttpHeader.ContentType]: contentType,
        [HttpHeader.Etag]: etag,
      },
    })
  } catch (error) {
    if (IsEnoentError.isEnoentError(error)) {
      return new Response('not found', {
        status: HttpStatusCode.NotFound,
        headers: {
          [HttpHeader.CrossOriginResourcePolicy]: 'same-origin',
        },
      })
    }
    console.error(`[preview-server] ${error}`)
    return new Response(`Internal Server Error`, {
      status: HttpStatusCode.ServerError,
      headers: {
        [HttpHeader.CrossOriginResourcePolicy]: 'same-origin',
      },
    })
  }
}
