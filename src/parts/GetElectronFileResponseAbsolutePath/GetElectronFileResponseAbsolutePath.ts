import * as GetPathName from '../GetPathName/GetPathName.ts'

export const getElectronFileResponseAbsolutePath = (url: string): string => {
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
