import type { ServerResponse } from 'node:http'
import { pipeline } from 'node:stream/promises'
import * as IsStreamPrematureCloseError from '../IsStreamPrematureCloseError/IsStreamPrematureCloseError.ts'
import * as IsEnoentError from '../IsEnoentError/IsEnoentError.ts'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.ts'

export const sendResponse = async (response: ServerResponse, result: Response): Promise<void> => {
  try {
    response.statusCode = result.status
    result.headers.forEach((value, key) => {
      response.setHeader(key, value)
    })
    if (!result.body) {
      response.end()
      return
    }
    await pipeline(result.body, response)
  } catch (error) {
    if (IsStreamPrematureCloseError.isStreamPrematureCloseError(error)) {
      return
    }
    if (IsEnoentError.isEnoentError(error)) {
      if (!response.headersSent) {
        response.statusCode = HttpStatusCode.NotFound
        response.end('Not Found')
      }
      return
    }
    console.error(`[preview-process] ${error}`)
    if (!response.headersSent) {
      response.statusCode = HttpStatusCode.ServerError
      response.end('Internal Server Error')
    }
  }
}
