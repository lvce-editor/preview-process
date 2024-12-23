import * as InfoRegistry from '../InfoRegistry/InfoRegistry.ts'

export const setInfo = (
  id: number,
  webViewId: string,
  webViewRoot: string,
  contentSecurityPolicy: string,
  iframeContent: string,
): void => {
  InfoRegistry.set(webViewId, {
    webViewId,
    webViewRoot,
    contentSecurityPolicy,
    iframeContent,
  })
}
