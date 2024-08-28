import type { WebViewServer } from '../WebViewServerTypes/WebViewServerTypes.ts'

const servers = Object.create(null)

export const set = (id: number, server: WebViewServer) => {
  servers[id] = server
}

export const get = (id: number) => {
  return servers[id]
}
