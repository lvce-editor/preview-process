import type { ServerResponse } from 'node:http'
import { pipeline } from 'node:stream/promises'

export const sendResponse = async (response: ServerResponse, result: Response): Promise<void> => {
  if (!result?.body) {
    response.end('not found')
    return
  }
  response.statusCode = result.status
  result.headers.forEach((value, key) => {
    response.setHeader(key, value)
  })
  await pipeline(result.body, response)
}
