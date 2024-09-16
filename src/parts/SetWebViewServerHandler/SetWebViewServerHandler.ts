import * as CreateWebViewServerHandler from '../CreateWebViewServerHandler/CreateWebViewServerHandler.ts'
import * as WebViewServerState from '../WebViewServerState/WebViewServerState.ts'

export const setWebViewServerHandler = (
  id: number,
  frameAncestors: string,
  webViewRoot: string,
  contentSecurityPolicy: string,
  iframeContent: string,
) => {
  const server = WebViewServerState.get(id)
  const handler = CreateWebViewServerHandler.createHandler(frameAncestors, webViewRoot, contentSecurityPolicy, iframeContent)
  server.setHandler(handler)
}
