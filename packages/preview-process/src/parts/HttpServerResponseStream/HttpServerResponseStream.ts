import type { ServerResponse } from 'node:http'
import { createReadStream } from 'node:fs'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.ts'
import * as IsStreamPrematureCloseError from '../IsStreamPrematureCloseError/IsStreamPrematureCloseError.ts'
import * as PipelineResponse from '../PipelineResponse/PipelineResponse.ts'

export const send = async (
  request: any,
  response: ServerResponse,
  status: number,
  headers: any,
  filePath: string,
): Promise<void> => {
  response.writeHead(status, headers)
  if (status === HttpStatusCode.NotFound) {
    response.end('Not Found')
    return
  }
  if (status === HttpStatusCode.NotModifed) {
    response.end()
    return
  }
  try {
    const stream = createReadStream(filePath)
    await PipelineResponse.pipelineResponse(response, stream)
  } catch (error) {
    if (IsStreamPrematureCloseError.isStreamPrematureCloseError(error)) {
      return
    }
    // TODO only do this if headers have not already been sent
    console.error(`[static server] response error at ${request.url} ${error}`)
    response.statusCode = HttpStatusCode.ServerError
    response.end('server error')
  }
}
