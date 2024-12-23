import * as GetHeaders from '../GetHeaders/GetHeaders.ts'
import * as PreviewInjectedCode from '../PreviewInjectedCode/PreviewInjectedCode.ts'
import * as SuccessResponse from '../SuccessResponse/SuccessResponse.ts'

export const getPreviewInjectedResponse = async (): Promise<any> => {
  const { injectedCode } = PreviewInjectedCode
  const headers = GetHeaders.getHeaders('/test/file.js')
  return SuccessResponse.create(injectedCode, headers)
}
