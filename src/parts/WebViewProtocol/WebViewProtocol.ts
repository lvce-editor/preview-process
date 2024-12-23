import * as GetIndexResponse from '../GetIndexResponse/GetIndexResponse.ts'
import * as GetInfo from '../GetInfo/GetInfo.ts'
import * as GetPathName from '../GetPathName/GetPathName.ts'
import * as GetPreviewInjectedResponse from '../GetPreviewInjectedResponse/GetPreviewInjectedResponse.ts'
import * as GetRemoteResponse from '../GetRemoteResponse/GetRemoteResponse.ts'
import * as GetWebViewRootResponse from '../GetWebViewRootResponse/GetWebViewRootResponse.ts'
import * as HttpMethod from '../HttpMethod/HttpMethod.ts'
import * as NotAllowedResponse from '../NotAllowedResponse/NotAllowedResponse.ts'

export const getResponse = async (method: string, url: string): Promise<any> => {
  // TODO allow head requests
  if (method !== HttpMethod.Get) {
    return NotAllowedResponse.create()
  }
  const info = GetInfo.getInfo(url)
  const pathName = GetPathName.getPathName2(url)
  if (pathName === '/') {
    return GetIndexResponse.getIndexResponse(info)
  }
  // TODO use pathname
  if (url.endsWith('preview-injected.js')) {
    return GetPreviewInjectedResponse.getPreviewInjectedResponse()
  }
  if (pathName.startsWith('/remote')) {
    return GetRemoteResponse.getRemoteResponse(pathName, info.webViewRoot)
  }
  return GetWebViewRootResponse.getWebViewRootResponse(info, pathName)
}
