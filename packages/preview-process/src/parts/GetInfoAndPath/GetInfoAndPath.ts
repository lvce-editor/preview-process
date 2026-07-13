import type { Info } from '../Info.ts'
import * as InfoRegistry from '../InfoRegistry/InfoRegistry.ts'

interface InfoAndPath {
  readonly info: Info
  readonly pathName: string
}

const emptyInfo: Info = {
  contentSecurityPolicy: '',
  iframeContent: '',
  remotePathPrefix: '/remote',
  webViewId: '',
  webViewRoot: '',
}

export const getInfoAndPath = (requestUrl: string): InfoAndPath | undefined => {
  const { pathname } = new URL(requestUrl, 'http://localhost')
  if (pathname.startsWith('/remote')) {
    return {
      info: emptyInfo,
      pathName: pathname,
    }
  }
  if (pathname.endsWith('/preview-injected.js')) {
    return {
      info: emptyInfo,
      pathName: pathname,
    }
  }
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
      pathName: '/index.html',
    }
  }

  return {
    info,
    pathName: '/' + parts.slice(2).join('/'),
  }
}
