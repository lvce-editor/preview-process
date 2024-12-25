import type { HandlerOptions } from '../HandlerOptions/HandlerOptions.ts'
import type { RequestOptions } from '../RequestOptions/RequestOptions.ts'
import * as HandleIndexHtml from '../HandleIndexHtml/HandleIndexHtml.ts'
import * as HandleOther from '../HandleOther/HandleOther.ts'
import * as HandlePreviewInjected from '../HandlePreviewInjected/HandlePreviewInjected.ts'
import * as HttpMethod from '../HttpMethod/HttpMethod.ts'
import * as ResolveFilePath from '../ResolveFilePath/ResolveFilePath.ts'
import { HeadResponse } from '../Responses/HeadResponse.ts'
import { MethodNotAllowedResponse } from '../Responses/MethodNotAllowedResponse.ts'

export const getResponse = async (request: RequestOptions, options: HandlerOptions): Promise<Response> => {
  if (request.method !== HttpMethod.Get && request.method !== HttpMethod.Head) {
    return new MethodNotAllowedResponse()
  }
  const filePath = ResolveFilePath.resolveFilePath(request.path, options.webViewRoot)
  const isHtml = filePath.endsWith('index.html')
  let response
  if (isHtml) {
    response = await HandleIndexHtml.handleIndexHtml(filePath, options)
  } else if (filePath.endsWith('preview-injected.js')) {
    response = await HandlePreviewInjected.handlePreviewInjected()
  } else {
    response = await HandleOther.handleOther(filePath, request)
  }
  if (request.method === HttpMethod.Head) {
    return new HeadResponse(response.status, response.headers)
  }
  return response
}
