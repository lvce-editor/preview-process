import * as GetContentType from '../GetContentType/GetContentType.ts'
import * as PreviewInjectedCode from '../PreviewInjectedCode/PreviewInjectedCode.ts'
import * as SetHeaders from '../SetHeaders/SetHeaders.ts'

export const handlePreviewInjected = (response) => {
  try {
    const { injectedCode } = PreviewInjectedCode
    const contentType = GetContentType.getContentType('/test/file.js')
    SetHeaders.setHeaders(response, {
      'Content-Type': contentType,
    })
    response.end(injectedCode)
  } catch (error) {
    console.error(`[preview-server] ${error}`)
  }
}
