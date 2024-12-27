import type { WebViewServer } from '../WebViewServerTypes/WebViewServerTypes.ts'

const servers: Record<number, WebViewServer> = Object.create(null)

export const set = (id: number, server: WebViewServer): void => {
  servers[id] = server
}

export const get = (id: number): WebViewServer => {
  const server = servers[id]
  if (!server) {
    throw new Error(`Server with id ${id} not found`)
  }
  return server
}

export const has = (id: number): boolean => {
  return id in servers
}
