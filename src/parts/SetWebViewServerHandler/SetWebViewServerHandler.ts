import * as CreateWebViewServerHandler from '../CreateWebViewServerHandler/CreateWebViewServerHandler.ts'
import * as WebViewServerState from '../WebViewServerState/WebViewServerState.ts'

export const setWebViewServerHandler = (
  id: number,
  frameAncestors: string,
  webViewRoot: string,
  contentSecurityPolicy: string,
  iframeContent: string,
): void => {
  const server = WebViewServerState.get(id)
  const handler = CreateWebViewServerHandler.createHandler(webViewRoot, contentSecurityPolicy, iframeContent)
  server.setHandler(handler)
}
