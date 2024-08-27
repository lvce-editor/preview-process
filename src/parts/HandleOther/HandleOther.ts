import { createReadStream } from 'node:fs'
import { pipeline } from 'node:stream/promises'
import * as GetContentType from '../GetContentType/GetContentType.ts'
import * as SetHeaders from '../SetHeaders/SetHeaders.ts'

export const handleOther = async (response, filePath) => {
  try {
    const contentType = GetContentType.getContentType(filePath)
    // TODO figure out which of these headers are actually needed
    SetHeaders.setHeaders(response, {
      'Cross-Origin-Resource-Policy': 'cross-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Access-Control-Allow-Origin': '*',
      'Content-Type': contentType,
    })
    await pipeline(createReadStream(filePath), response)
  } catch (error) {
    console.error(error)
    response.end(`[preview-server] ${error}`)
  }
}
