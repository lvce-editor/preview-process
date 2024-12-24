import * as GetHeaders from '../GetHeaders/GetHeaders.ts'
import * as SuccessResponse from '../SuccessResponse/SuccessResponse.ts'

export const getPreviewInjectedResponse = async (injectedCode: string): Promise<any> => {
  const headers = GetHeaders.getHeaders('/test/file.js')
  return SuccessResponse.create(injectedCode, headers)
}
