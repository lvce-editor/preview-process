import * as CreateWebViewServer from '../CreateWebViewServer/CreateWebViewServer.ts'
import * as HandleElectronMessagePort from '../HandleElectronMessagePort/HandleElectronMessagePort.ts'
import * as SetWebViewServerHandler from '../SetWebViewServerHandler/SetWebViewServerHandler.ts'
import * as StartWebViewServer from '../StartWebViewServer/StartWebViewServer.ts'

export const commandMap = {
  'WebViewServer.create': CreateWebViewServer.createWebViewServer,
  'WebViewServer.setHandler': SetWebViewServerHandler.setWebViewServerHandler,
  'WebViewServer.start': StartWebViewServer.startWebViewServer,
  'HandleElectronMessagePort.handleElectronMessagePort':
    HandleElectronMessagePort.handleElectronMessagePort,
}
