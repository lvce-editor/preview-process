import { fileURLToPath } from 'node:url'

export const resolveFilePath = (pathName: string, webViewRoot: string, remotePathPrefix: string = '/remote'): string => {
  // Handle remote paths
  if (pathName.startsWith(`${remotePathPrefix}/`)) {
    const filePath = pathName.slice(remotePathPrefix.length + 1) // +1 for the trailing slash
    return fileURLToPath(`file://${filePath}`)
  }
  // Handle normal paths
  const filePath = fileURLToPath(`file://${webViewRoot}${pathName}`)
  return filePath
}
