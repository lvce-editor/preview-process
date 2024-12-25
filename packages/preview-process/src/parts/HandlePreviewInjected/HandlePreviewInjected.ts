import * as GetContentType from '../GetContentType/GetContentType.ts'
import * as PreviewInjectedCode from '../PreviewInjectedCode/PreviewInjectedCode.ts'
import { ContentResponse } from '../Responses/ContentResponse.ts'
import { NotFoundResponse } from '../Responses/NotFoundResponse.ts'

export const handlePreviewInjected = async (): Promise<Response> => {
  try {
    const { injectedCode } = PreviewInjectedCode
    const contentType = GetContentType.getContentType('/test/file.js')
    return new ContentResponse(injectedCode, contentType)
  } catch (error) {
    console.error(`[preview-server] ${error}`)
    return new NotFoundResponse()
  }
}
