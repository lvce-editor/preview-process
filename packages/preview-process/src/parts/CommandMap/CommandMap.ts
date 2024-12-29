import * as CreateWebViewServer from '../CreateWebViewServer/CreateWebViewServer.ts'
import * as HandleElectronMessagePort from '../HandleElectronMessagePort/HandleElectronMessagePort.ts'
import * as SetInfo2 from '../SetInfo2/SetInfo2.ts'
import * as SetInfo from '../SetInfo/SetInfo.ts'
import * as SetWebViewServerHandler from '../SetWebViewServerHandler/SetWebViewServerHandler.ts'
import * as StartWebViewServer from '../StartWebViewServer/StartWebViewServer.ts'

export const commandMap = {
  'HandleElectronMessagePort.handleElectronMessagePort': HandleElectronMessagePort.handleElectronMessagePort,
  'WebViewServer.create': CreateWebViewServer.createWebViewServer,
  'WebViewServer.setHandler': SetWebViewServerHandler.setWebViewServerHandler,
  'WebViewServer.setInfo': SetInfo.setInfo,
  'WebViewServer.setInfo2': SetInfo2.setInfo2,
  'WebViewServer.start': StartWebViewServer.startWebViewServer,
}
