import type { RequestOptions } from '../RequestOptions/RequestOptions.ts'
import * as FileSystem from '../FileSystem/FileSystem.ts'
import * as GetContentType from '../GetContentType/GetContentType.ts'
import * as HandleRangeRequest from '../HandleRangeRequest/HandleRangeRequest.ts'
import * as HttpHeader from '../HttpHeader/HttpHeader.ts'
import * as IsEnoentError from '../IsEnoentError/IsEnoentError.ts'
import { NotFoundResponse } from '../Responses/NotFoundResponse.ts'
import { ServerErrorResponse } from '../Responses/ServerErrorResponse.ts'

export const handleOther = async (filePath: string, requestOptions: RequestOptions): Promise<Response> => {
  try {
    if (requestOptions.range) {
      return await HandleRangeRequest.handleRangeRequest(filePath, requestOptions.range)
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
      return new NotFoundResponse()
    }
    console.error(`[preview-server] ${error}`)
    return new ServerErrorResponse()
  }
}
