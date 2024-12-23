import * as CreateWebViewServerHandler from '../CreateWebViewServerHandler/CreateWebViewServerHandler.ts'
import * as InfoRegistry from '../InfoRegistry/InfoRegistry.ts'
import * as WebViewServerState from '../WebViewServerState/WebViewServerState.ts'

export const setInfo = (id: number, webViewId: string, webViewRoot: string): void => {
  InfoRegistry.set(webViewId, {
    webViewId,
    webViewRoot,
  })
}
