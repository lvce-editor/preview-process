import type { Info } from '../Info.ts'
import * as GetProtocolMatch from '../GetProtocolMatch/GetProtocolMatch.ts'
import * as InfoRegistry from '../InfoRegistry/InfoRegistry.ts'

// TODO make scheme dynamic
const allowedProtocols = ['lvce-webview', 'lvce-oss-webview']

export const getInfo = (url: string): Info => {
  const { protocol, domain } = GetProtocolMatch.getProtocolMatch(url)
  if (!allowedProtocols.includes(protocol)) {
    throw new Error(`unsupported protocol`)
  }
  const item = InfoRegistry.get(domain)
  if (!item) {
    throw new Error(`webview info not found`)
  }
  return item
}
