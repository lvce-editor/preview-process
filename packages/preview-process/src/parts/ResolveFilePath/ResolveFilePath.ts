import { fileURLToPath } from 'node:url'

export const resolveFilePath = (pathName: string, webViewRoot: string, remotePathPrefix: string = '/remote'): string => {
  if (pathName.startsWith(remotePathPrefix)) {
    const filePath = pathName.slice(remotePathPrefix.length)
    return fileURLToPath(`file://${filePath}`)
  }
  const filePath = fileURLToPath(`file://${webViewRoot}${pathName}`)
  return filePath
}
