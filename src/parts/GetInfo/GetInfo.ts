import * as InfoRegistry from '../InfoRegistry/InfoRegistry.ts'

const RE_URL_MATCH = /^([a-z-]+):\/\/([a-z-.]+)/

// TODO make scheme dynamic
const allowedProtocols = ['lvce-webview', 'lvce-oss-webview']

export const getInfo = (url: string) => {
  const match = url.match(RE_URL_MATCH)
  if (!match) {
    throw new Error(`Failed to parse url`)
  }
  const protocol = match[1]
  const domain = match[2]
  if (!allowedProtocols.includes(protocol)) {
    throw new Error(`unsupported protocol`)
  }
  const item = InfoRegistry.get(domain)
  if (!item) {
    throw new Error(`webview info not found`)
  }
  return item
}
