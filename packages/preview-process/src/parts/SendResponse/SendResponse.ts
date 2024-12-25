import type { ServerResponse } from 'node:http'
import { pipeline } from 'node:stream/promises'
import * as IsStreamPrematureCloseError from '../IsStreamPrematureCloseError/IsStreamPrematureCloseError.ts'

export const sendResponse = async (response: ServerResponse, result: Response): Promise<void> => {
  response.statusCode = result.status
  result.headers.forEach((value, key) => {
    response.setHeader(key, value)
  })
  if (!result.body) {
    response.end()
    return
  }
  try {
    await pipeline(result.body, response)
  } catch (error) {
    if (IsStreamPrematureCloseError.isStreamPrematureCloseError(error)) {
      return
    }
    console.error(`[preview-process] ${error}`)
  }
}
