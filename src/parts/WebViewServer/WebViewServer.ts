import * as CreateWebViewServer from '../CreateWebViewServer/CreateWebViewServer.ts'
import * as CreateWebViewServerHandler from '../CreateWebViewServerHandler/CreateWebViewServerHandler.ts'

interface State {
  promise: any
}

const state: State = {
  promise: undefined,
}

// TODO move webview preview
// server into separate process

export const start = async (port) => {
  if (!state.promise) {
    state.promise = CreateWebViewServer.createWebViewServer(port)
  }
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
