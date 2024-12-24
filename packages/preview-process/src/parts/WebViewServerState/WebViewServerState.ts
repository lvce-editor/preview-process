import type { WebViewServer } from '../WebViewServerTypes/WebViewServerTypes.ts'

const servers = Object.create(null)

export const set = (id: number, server: WebViewServer): void => {
  servers[id] = server
}

export const get = (id: number): WebViewServer => {
  return servers[id]
}

export const has = (id: number): boolean => {
  return id in servers
}
