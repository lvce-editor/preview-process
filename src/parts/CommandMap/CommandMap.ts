import * as WebViewServer from '../WebViewServer/WebViewServer.ts'

export const commandMap = {
  'WebViewServer.start': WebViewServer.start,
  'WebViewServer.setHandler': WebViewServer.setHandler,
}
