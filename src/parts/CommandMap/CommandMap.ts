import * as CreateWebViewServer from '../CreateWebViewServer/CreateWebViewServer.ts'
import * as HandleElectronMessagePort from '../HandleElectronMessagePort/HandleElectronMessagePort.ts'
import * as SetInfo from '../SetInfo/SetInfo.ts'
import * as SetWebViewServerHandler from '../SetWebViewServerHandler/SetWebViewServerHandler.ts'
import * as StartWebViewServer from '../StartWebViewServer/StartWebViewServer.ts'
import * as WebViewProtocol from '../WebViewProtocol/WebViewProtocol.ts'

export const commandMap = {
  'HandleElectronMessagePort.handleElectronMessagePort': HandleElectronMessagePort.handleElectronMessagePort,
  'WebViewProtocol.getResponse': WebViewProtocol.getResponse,
  'WebViewServer.create': CreateWebViewServer.createWebViewServer,
  'WebViewServer.setHandler': SetWebViewServerHandler.setWebViewServerHandler,
  'WebViewServer.start': StartWebViewServer.startWebViewServer,
  'WebViewServer.setInfo': SetInfo.setInfo,
}
