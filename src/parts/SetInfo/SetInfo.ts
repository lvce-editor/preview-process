import * as CreateWebViewServerHandler from '../CreateWebViewServerHandler/CreateWebViewServerHandler.ts'
import * as WebViewServerState from '../WebViewServerState/WebViewServerState.ts'
import * as InfoRegistry from '../InfoRegistry/InfoRegistry.ts'

export const setInfo = (id: number, webViewId: string, webViewRoot: string): void => {
  InfoRegistry.set(webViewId, {
    webViewId,
    webViewRoot,
  })
}
