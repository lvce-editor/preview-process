import { ServerResponse } from 'node:http'
import { emptyResponse } from '../EmptyResponse/EmptyResponse.ts'
import * as FileSystem from '../FileSystem/FileSystem.ts'
import * as GetContentType from '../GetContentType/GetContentType.ts'
import * as HandleRangeRequest from '../HandleRangeRequest/HandleRangeRequest.ts'
import * as HttpHeader from '../HttpHeader/HttpHeader.ts'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.ts'
import * as IsEnoentError from '../IsEnoentError/IsEnoentError.ts'

export const handleOther = async (filePath: string, range: any, res: ServerResponse) => {
  try {
    if (range) {
      await HandleRangeRequest.handleRangeRequest(filePath, range, res)
      return emptyResponse
    }
    const contentType = GetContentType.getContentType(filePath)
    // TODO figure out which of these headers are actually needed
    const content = await FileSystem.readFile(filePath)
    return new Response(content, {
      headers: {
        [HttpHeader.CrossOriginResourcePolicy]: 'same-origin',
        [HttpHeader.ContentType]: contentType,
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
    console.error(error)
    return new Response(`[preview-server] ${error}`)
  }
}
