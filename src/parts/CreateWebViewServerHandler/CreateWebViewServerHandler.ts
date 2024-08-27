import { fileURLToPath } from 'node:url'
import * as GetPathName from '../GetPathName/GetPathName.ts'
import * as HandleIndexHtml from '../HandleIndexHtml/HandleIndexHtml.ts'
import * as HandleOther from '../HandleOther/HandleOther.ts'
import * as HandlePreviewInjected from '../HandlePreviewInjected/HandlePreviewInjected.ts'

export const createHandler = (frameAncestors, webViewRoot) => {
  const handleRequest = async (request, response) => {
    let pathName = GetPathName.getPathName(request)
    if (pathName === '/') {
      pathName += 'index.html'
    }

    const filePath = fileURLToPath(`file://${webViewRoot}${pathName}`)
    const isHtml = filePath.endsWith('index.html')
    if (isHtml) {
      return HandleIndexHtml.handleIndexHtml(response, filePath, frameAncestors)
    }

    if (filePath.endsWith('preview-injected.js')) {
      HandlePreviewInjected.handlePreviewInjected(response)
      return
    }

    return HandleOther.handleOther(response, filePath)
  }

  return handleRequest
}
