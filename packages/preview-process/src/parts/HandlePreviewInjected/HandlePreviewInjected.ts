import * as GetContentType from '../GetContentType/GetContentType.ts'
import * as PreviewInjectedCode from '../PreviewInjectedCode/PreviewInjectedCode.ts'
import { ContentResponse } from '../Responses/ContentResponse.ts'

export const handlePreviewInjected = async (): Promise<Response> => {
  const { injectedCode } = PreviewInjectedCode
  const contentType = GetContentType.getContentType('/test/file.js')
  return new ContentResponse(injectedCode, contentType)
}
