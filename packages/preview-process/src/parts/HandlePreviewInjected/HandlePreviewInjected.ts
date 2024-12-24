import * as GetContentType from '../GetContentType/GetContentType.ts'
import * as PreviewInjectedCode from '../PreviewInjectedCode/PreviewInjectedCode.ts'

export const handlePreviewInjected = async (): Promise<Response> => {
  try {
    const { injectedCode } = PreviewInjectedCode
    const contentType = GetContentType.getContentType('/test/file.js')
    return new Response(injectedCode, {
      headers: {
        'Content-Type': contentType,
      },
    })
  } catch (error) {
    console.error(`[preview-server] ${error}`)
    return new Response('not found')
  }
}
