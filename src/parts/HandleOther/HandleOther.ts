import * as FileSystem from '../FileSystem/FileSystem.ts'
import * as GetContentType from '../GetContentType/GetContentType.ts'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.ts'
import * as HttpHeader from '../HttpHeader/HttpHeader.ts'
import * as IsEnoentError from '../IsEnoentError/IsEnoentError.ts'
import * as CrossOriginEmbedderPolicy from '../CrossOriginEmbedderPolicy/CrossOriginEmbedderPolicy.ts'
import * as CrossOriginResourcePolicy from '../CrossOriginResourcePolicy/CrossOriginResourcePolicy.ts'

export const handleOther = async (filePath: string) => {
  try {
    const contentType = GetContentType.getContentType(filePath)
    // TODO figure out which of these headers are actually needed
    const content = await FileSystem.readFile(filePath)
    return new Response(content, {
      headers: {
        [HttpHeader.CrossOriginResourcePolicy]: CrossOriginResourcePolicy.value, // TODO use same origin
        [HttpHeader.CrossOriginEmbedderPolicy]: CrossOriginEmbedderPolicy.value, // TODO only for index html?
        [HttpHeader.AccessControlAllowOrigin]: '*', // TODO
        [HttpHeader.ContentType]: contentType,
      },
    })
  } catch (error) {
    if (IsEnoentError.isEnoentError(error)) {
      return new Response('not found', {
        status: HttpStatusCode.NotFound,
        headers: {
          [HttpHeader.CrossOriginResourcePolicy]: CrossOriginResourcePolicy.value,
          [HttpHeader.CrossOriginEmbedderPolicy]: CrossOriginEmbedderPolicy.value,
          [HttpHeader.AccessControlAllowOrigin]: '*',
        },
      })
    }
    console.error(error)
    return new Response(`[preview-server] ${error}`)
  }
}
