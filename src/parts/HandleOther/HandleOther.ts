import { readFile } from 'node:fs/promises'
import * as GetContentType from '../GetContentType/GetContentType.ts'

export const handleOther = async (filePath: string) => {
  try {
    const contentType = GetContentType.getContentType(filePath)
    // TODO figure out which of these headers are actually needed
    const content = await readFile(filePath)
    return new Response(content, {
      headers: {
        'Cross-Origin-Resource-Policy': 'cross-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Access-Control-Allow-Origin': '*',
        'Content-Type': contentType,
      },
    })
  } catch (error) {
    console.error(error)
    return new Response(`[preview-server] ${error}`)
  }
}
