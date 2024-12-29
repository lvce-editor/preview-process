import type { Info } from '../Info.ts'
import * as InfoRegistry from '../InfoRegistry/InfoRegistry.ts'

interface InfoAndPath {
  readonly info: Info
  readonly pathname: string
}

export const getInfoAndPath = (requestUrl: string): InfoAndPath | undefined => {
  const { pathname } = new URL(requestUrl, 'http://localhost')
  const parts = pathname.split('/')
  if (parts.length < 2) {
    return undefined
  }
  const webViewId = parts[1]
  const info = InfoRegistry.get(webViewId)
  if (!info) {
    return undefined
  }

  if (pathname === `/${webViewId}` || pathname === `/${webViewId}/`) {
    return {
      info,
      pathname: '/index.html',
    }
  }

  return {
    info,
    pathname: '/' + parts.slice(2).join('/'),
  }
}
