<<<<<<< HEAD
import { join } from 'node:path'
=======
>>>>>>> origin/main
import * as GetPathName from '../GetPathName/GetPathName.ts'

export const getElectronFileResponseAbsolutePath = (url: string, webViewRoot?: string, indexHtmlContent?: string): string => {
  if (webViewRoot) {
    const pathName = GetPathName.getPathName(url)
    if (pathName === '/') {
      return join(webViewRoot, '')
    }
    console.log({ pathName })
  }
  // TODO support windows paths
  // TODO disallow dot dot in paths
  const pathName = GetPathName.getPathName2(url)
  if (pathName.endsWith('/')) {
    return pathName + 'index.html'
  }
  if (pathName.startsWith('/remote//')) {
    return pathName.slice('/remote/'.length)
  }
  if (pathName.startsWith('/remote/')) {
    return pathName.slice('/remote'.length)
  }
  return pathName
}
