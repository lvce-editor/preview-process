import * as FileSystem from '../FileSystem/FileSystem.ts'
import * as GetContentType from '../GetContentType/GetContentType.ts'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.ts'
import * as IsEnoentError from '../IsEnoentError/IsEnoentError.ts'

export const handleOther = async (filePath: string) => {
  try {
    const contentType = GetContentType.getContentType(filePath)
    // TODO figure out which of these headers are actually needed
    const content = await FileSystem.readFile(filePath)
    return new Response(content, {
      headers: {
        'Cross-Origin-Resource-Policy': 'cross-origin', // TODO use same origin
        'Cross-Origin-Embedder-Policy': 'require-corp', // TODO only for index html?
        'Access-Control-Allow-Origin': '*', // TODO
        'Content-Type': contentType,
      },
    })
  } catch (error) {
    if (IsEnoentError.isEnoentError(error)) {
      return new Response('not found', {
        status: HttpStatusCode.NotFound,
        headers: {
          'Cross-Origin-Resource-Policy': 'cross-origin',
          'Cross-Origin-Embedder-Policy': 'require-corp',
          'Access-Control-Allow-Origin': '*',
        },
      })
    }
    console.error(error)
    return new Response(`[preview-server] ${error}`)
  }
}
