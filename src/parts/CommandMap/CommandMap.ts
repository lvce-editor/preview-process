import * as CreateWebViewServer from '../CreateWebViewServer/CreateWebViewServer.ts'
import * as SetWebViewServerHandler from '../SetWebViewServerHandler/SetWebViewServerHandler.ts'
import * as StartWebViewServer from '../StartWebViewServer/StartWebViewServer.ts'

export const commandMap = {
  'WebViewServer.create': CreateWebViewServer.createWebViewServer,
  'WebViewServer.start': StartWebViewServer.startWebViewServer,
  'WebViewServer.setHandler': SetWebViewServerHandler.setWebViewServerHandler,
}
