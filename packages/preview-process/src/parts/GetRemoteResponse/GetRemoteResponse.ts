import { fileURLToPath } from 'node:url'
import * as ErrorCodes from '../ErrorCodes/ErrorCodes.ts'
import * as FileSystem from '../FileSystem/FileSystem.ts'
import * as GetHeaders from '../GetHeaders/GetHeaders.ts'
import * as InternalServerErrorResponse from '../InternalServerErrorResponse/InternalServerErrorResponse.ts'
import * as NotFoundResponse from '../NotFoundResponse/NotFoundResponse.ts'
import * as SuccessResponse from '../SuccessResponse/SuccessResponse.ts'

const getPath = (pathName: string, webViewRoot: string): string => {
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
  // TODO use webviewRootUri in this case or path.join
  const filePath = fileURLToPath(`file://${webViewRoot}${pathName}`)
  return filePath
}

export const getRemoteResponse = async (pathName: string, webViewRoot: string): Promise<string> => {
  const absolutePath = getPath(pathName, webViewRoot)
  let content
  try {
    content = await FileSystem.readFile(absolutePath)
  } catch (error) {
    if (error && error.code === ErrorCodes.ENOENT) {
      return NotFoundResponse.create()
    }
    return InternalServerErrorResponse.create()
  }
  const headers = GetHeaders.getHeaders(absolutePath)
  return SuccessResponse.create(content, headers)
}
