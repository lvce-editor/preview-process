import { join } from 'node:path'
import type { Info } from '../Info.ts'
import * as ErrorCodes from '../ErrorCodes/ErrorCodes.ts'
import * as FileSystem from '../FileSystem/FileSystem.ts'
import * as GetHeaders from '../GetHeaders/GetHeaders.ts'
import * as InternalServerErrorResponse from '../InternalServerErrorResponse/InternalServerErrorResponse.ts'
import * as NotFoundResponse from '../NotFoundResponse/NotFoundResponse.ts'
import * as SuccessResponse from '../SuccessResponse/SuccessResponse.ts'

export const getWebViewRootResponse = async (info: Info, pathName: string): Promise<any> => {
  // TODO use stat and etag
  const absolutePath = join(info.webViewRoot, pathName)
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
