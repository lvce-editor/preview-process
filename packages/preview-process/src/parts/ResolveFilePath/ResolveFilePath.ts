import { fileURLToPath } from 'node:url'

export const resolveFilePath = (pathName: string, webViewRoot: string, remotePathPrefix: string = '/remote'): string => {
  // TODO remove this, double slash should not be allowed
  // TODO use path.resolve and verify that file path is in allowed roots
  if (pathName.startsWith('/remote//')) {
    const filePath = pathName.slice('/remote/'.length)
    return fileURLToPath(`file://${filePath}`)
  }
  if (pathName.startsWith('/remote/')) {
    const filePath = pathName.slice('/remote'.length)
    return fileURLToPath(`file://${filePath}`)
  }
  if (webViewRoot.startsWith('file://')) {
    return fileURLToPath(`${webViewRoot}${pathName}`)
  }
  const filePath = fileURLToPath(`file://${webViewRoot}${pathName}`)
  return filePath
}
