import { ElectronResponse } from '../ElectronResponse/ElectronResponse.ts'
import * as GetInfo from '../GetInfo/GetInfo.ts'
import * as GetPathName from '../GetPathName/GetPathName.ts'
import * as GetResponse from '../GetResponse/GetResponse.ts'
import type { HandlerOptions } from '../HandlerOptions/HandlerOptions.ts'
import { serializeResponse } from '../SerializeResponse/SerializeResponse.ts'

export const getResponse = async (method: string, url: string): Promise<ElectronResponse> => {
  const info = GetInfo.getInfo(url)
  const pathName = GetPathName.getPathName2(url)
  const requestOptions = {
    method,
    path: pathName,
    headers: {},
  }
  const handlerOptions: HandlerOptions = {
    contentSecurityPolicy: info.contentSecurityPolicy,
    iframeContent: info.iframeContent,
    stream: false,
    webViewRoot: info.webViewRoot,
  }
  const jsResponse = await GetResponse.getResponse(requestOptions, handlerOptions)
  const serializedResponse = await serializeResponse(jsResponse)
  return serializedResponse
}
