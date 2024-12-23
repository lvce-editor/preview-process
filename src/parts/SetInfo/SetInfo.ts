import { fileURLToPath } from 'node:url'
import * as InfoRegistry from '../InfoRegistry/InfoRegistry.ts'

export const setInfo = (
  id: number,
  webViewId: string,
  webViewUri: string,
  contentSecurityPolicy: string,
  iframeContent: string,
): void => {
  // TODO set webviewroot and webviewUri
  let webViewRoot = webViewUri
  if (webViewRoot.startsWith('file://')) {
    webViewRoot = fileURLToPath(webViewRoot).toString()
  }
  InfoRegistry.set(webViewId, {
    webViewId,
    webViewRoot,
    contentSecurityPolicy,
    iframeContent,
  })
}
