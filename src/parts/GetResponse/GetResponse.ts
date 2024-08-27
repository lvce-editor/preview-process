import { fileURLToPath } from 'node:url'
import * as HandleIndexHtml from '../HandleIndexHtml/HandleIndexHtml.ts'
import * as HandleOther from '../HandleOther/HandleOther.ts'
import * as HandlePreviewInjected from '../HandlePreviewInjected/HandlePreviewInjected.ts'

export const getResponse = async (
  pathName: string,
  frameAncestors: string,
  webViewRoot: string,
): Promise<Response> => {
  const filePath = fileURLToPath(`file://${webViewRoot}${pathName}`)
  const isHtml = filePath.endsWith('index.html')
  if (isHtml) {
    return HandleIndexHtml.handleIndexHtml(filePath, frameAncestors)
  }
  if (filePath.endsWith('preview-injected.js')) {
    return HandlePreviewInjected.handlePreviewInjected()
  }
  return HandleOther.handleOther(filePath)
}
