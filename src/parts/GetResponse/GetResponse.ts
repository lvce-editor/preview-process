import { ServerResponse } from 'node:http'
import * as HandleIndexHtml from '../HandleIndexHtml/HandleIndexHtml.ts'
import * as HandleOther from '../HandleOther/HandleOther.ts'
import * as HandlePreviewInjected from '../HandlePreviewInjected/HandlePreviewInjected.ts'
import * as ResolveFilePath from '../ResolveFilePath/ResolveFilePath.ts'

export const getResponse = async (
  pathName: string,
  frameAncestors: string,
  webViewRoot: string,
  contentSecurityPolicy: string,
  iframeContent: string,
  range: any,
  response: ServerResponse,
): Promise<Response> => {
  const filePath = ResolveFilePath.resolveFilePath(pathName, webViewRoot)
  const isHtml = filePath.endsWith('index.html')
  if (isHtml) {
    return HandleIndexHtml.handleIndexHtml(filePath, frameAncestors, contentSecurityPolicy, iframeContent)
  }
  if (filePath.endsWith('preview-injected.js')) {
    return HandlePreviewInjected.handlePreviewInjected()
  }
  return HandleOther.handleOther(filePath, range, response)
}
