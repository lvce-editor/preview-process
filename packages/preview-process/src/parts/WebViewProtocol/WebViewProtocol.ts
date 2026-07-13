import type { ElectronResponse } from '../ElectronResponse/ElectronResponse.ts'
import type { HandlerOptions } from '../HandlerOptions/HandlerOptions.ts'
import * as GetInfo from '../GetInfo/GetInfo.ts'
import * as GetPathName from '../GetPathName/GetPathName.ts'
import * as GetResponse from '../GetResponse/GetResponse.ts'
import * as SerializeResponse from '../SerializeResponse/SerializeResponse.ts'

export const getResponse = async (method: string, url: string, headers?: any): Promise<ElectronResponse> => {
  const info = GetInfo.getInfo(url)
  let pathName = GetPathName.getPathName2(url)
  if (pathName === '/') {
    pathName += 'index.html'
  }
  const requestOptions = {
    headers: headers || {},
    method,
    path: pathName,
  }
  const handlerOptions: HandlerOptions = {
    contentSecurityPolicy: info.contentSecurityPolicy,
    etag: false,
    iframeContent: info.iframeContent,
    remotePathPrefix: '/remote',
    stream: false,
    webViewRoot: info.webViewRoot,
  }
  const jsResponse = await GetResponse.getResponse(requestOptions, handlerOptions)
  const serializedResponse = await SerializeResponse.serializeResponse(jsResponse)
  return serializedResponse
}
