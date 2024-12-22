import { readFile } from 'node:fs/promises'
import * as ErrorCodes from '../ErrorCodes/ErrorCodes.ts'
import * as FileSystem from '../FileSystem/FileSystem.ts'
import * as GetElectronFileResponseAbsolutePath from '../GetElectronFileResponseAbsolutePath/GetElectronFileResponseAbsolutePath.ts'
import * as GetHeaders from '../GetHeaders/GetHeaders.ts'
import * as HttpMethod from '../HttpMethod/HttpMethod.ts'
import * as InjectPreviewScript from '../InjectPreviewScript/InjectPreviewScript.ts'
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
  const absolutePath = GetElectronFileResponseAbsolutePath.getElectronFileResponseAbsolutePath(url)
  if (!absolutePath) {
    return NotFoundResponse.create()
  }
  if (absolutePath.endsWith('/index.html')) {
    let content
    try {
      content = await readFile(absolutePath, 'utf8')
    } catch (error) {
      if (error && error.code === ErrorCodes.ENOENT) {
        return NotFoundResponse.create()
      }
      return InternalServerErrorResponse.create()
    }
    const newContent = InjectPreviewScript.injectPreviewScript(content)
    const headers = GetHeaders.getHeaders(absolutePath)
    return SuccessResponse.create(newContent, headers)
  }
  if (url.endsWith('preview-injected.js')) {
    const { injectedCode } = PreviewInjectedCode
    const headers = GetHeaders.getHeaders('/test/file.js')
    return SuccessResponse.create(injectedCode, headers)
  }
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
