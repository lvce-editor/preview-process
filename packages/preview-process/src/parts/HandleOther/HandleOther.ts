import type { RequestOptions } from '../RequestOptions/RequestOptions.ts'
import * as FileSystem from '../FileSystem/FileSystem.ts'
import * as GetContentType from '../GetContentType/GetContentType.ts'
import * as HandleRangeRequest from '../HandleRangeRequest/HandleRangeRequest.ts'
import * as IsEnoentError from '../IsEnoentError/IsEnoentError.ts'
import { ContentResponse } from '../Responses/ContentResponse.ts'
import { NotFoundResponse } from '../Responses/NotFoundResponse.ts'
import { ServerErrorResponse } from '../Responses/ServerErrorResponse.ts'

export const handleOther = async (filePath: string, requestOptions: RequestOptions): Promise<Response> => {
  try {
    if (requestOptions.range) {
      return await HandleRangeRequest.handleRangeRequest(filePath, requestOptions.range)
    }
    const contentType = GetContentType.getContentType(filePath)
    const content = await FileSystem.readFile(filePath)
    return new ContentResponse(content, contentType)
  } catch (error) {
    if (IsEnoentError.isEnoentError(error)) {
      return new NotFoundResponse()
    }
    console.error(`[preview-server] ${error}`)
    return new ServerErrorResponse()
  }
}
