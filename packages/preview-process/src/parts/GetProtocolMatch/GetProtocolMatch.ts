import type { ProtocolMatch } from '../ProtocolMatch/ProtocolMatch.ts'

const RE_URL_MATCH = /^([a-z-]+):\/\/([a-z-.]+)/

export const getProtocolMatch = (url: string): ProtocolMatch => {
  // TODO maybe use URL to parse the url
  const match = url.match(RE_URL_MATCH)
  if (!match) {
    throw new Error(`Failed to parse url`)
  }
  return {
    domain: match[2],
    protocol: match[1],
  }
}
