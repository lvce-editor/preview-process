import { join } from 'node:path'
import * as ErrorCodes from '../ErrorCodes/ErrorCodes.ts'
import * as FileSystem from '../FileSystem/FileSystem.ts'
import * as GetHeaders from '../GetHeaders/GetHeaders.ts'
import * as GetInfo from '../GetInfo/GetInfo.ts'
import * as GetPathName from '../GetPathName/GetPathName.ts'
import * as GetRemoteResponse from '../GetRemoteResponse/GetRemoteResponse.ts'
import * as HttpHeader from '../HttpHeader/HttpHeader.ts'
import * as HttpMethod from '../HttpMethod/HttpMethod.ts'
import * as InternalServerErrorResponse from '../InternalServerErrorResponse/InternalServerErrorResponse.ts'
import * as NotAllowedResponse from '../NotAllowedResponse/NotAllowedResponse.ts'
import * as NotFoundResponse from '../NotFoundResponse/NotFoundResponse.ts'
import * as PreviewInjectedCode from '../PreviewInjectedCode/PreviewInjectedCode.ts'
import * as SuccessResponse from '../SuccessResponse/SuccessResponse.ts'

export const getResponse = async (method: string, url: string): Promise<any> => {
  // TODO allow head requests
  if (method !== HttpMethod.Get) {
    return NotAllowedResponse.create()
  }
  const info = GetInfo.getInfo(url)
  const pathName = GetPathName.getPathName2(url)
  if (pathName === '/') {
    const headers = GetHeaders.getHeaders('/test/index.html')
    return {
      body: info.iframeContent,
      init: {
        status: 200,
        headers: {
          ...headers,
          [HttpHeader.ContentSecurityPolicy]: info.contentSecurityPolicy,
        },
      },
    }
  }
  // TODO use pathname
  if (url.endsWith('preview-injected.js')) {
    const { injectedCode } = PreviewInjectedCode
    const headers = GetHeaders.getHeaders('/test/file.js')
    return SuccessResponse.create(injectedCode, headers)
  }
  if (pathName.startsWith('/remote')) {
    return GetRemoteResponse.getRemoteResponse(pathName, info.webViewRoot)
  }
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
