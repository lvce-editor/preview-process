const getPathName = (url: string) => {
  try {
    const p = new URL(url).pathname
    return p
  } catch {
    return ''
  }
}

export const getElectronFileResponseAbsolutePath = (url: string) => {
  // TODO support windows paths
  // TODO disallow dot dot in paths
  const pathName = getPathName(url)
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
