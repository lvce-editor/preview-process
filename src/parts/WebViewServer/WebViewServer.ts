import * as CreateWebViewServer from '../CreateWebViewServer/CreateWebViewServer.ts'
import * as CreateWebViewServerHandler from '../CreateWebViewServerHandler/CreateWebViewServerHandler.ts'

type State = {
  promise: any
}

const state: State = {
  promise: undefined,
}

// TODO move webview preview
// server into separate process

export const start = async (port) => {
<<<<<<< Updated upstream:src/parts/WebViewServer/WebViewServer.ts
  state.promise ||= CreateWebViewServer.createWebViewServer(port)

=======
  state.promise ||= CreateWebViewServer.createWebViewServer(port);
>>>>>>> Stashed changes:src/parts/WebViewServer/WebViewServer.js
  return state.promise
}

export const setHandler = async (frameAncestors, webViewRoot) => {
  const server = await state.promise
  const handler = CreateWebViewServerHandler.createHandler(
    frameAncestors,
    webViewRoot,
  )
  server.setHandler(handler)
}
