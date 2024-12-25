import * as HandleIndexHtml from '../HandleIndexHtml/HandleIndexHtml.ts'
import * as HandleOther from '../HandleOther/HandleOther.ts'
import * as HandlePreviewInjected from '../HandlePreviewInjected/HandlePreviewInjected.ts'
import * as HttpMethod from '../HttpMethod/HttpMethod.ts'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.ts'
import * as ResolveFilePath from '../ResolveFilePath/ResolveFilePath.ts'

export const getResponse = async (
  pathName: string,
  webViewRoot: string,
  contentSecurityPolicy: string,
  iframeContent: string,
  range: any,
  method: string | undefined,
): Promise<Response> => {
  if (method !== HttpMethod.Get && method !== HttpMethod.Head) {
    return new Response('Method Not Allowed', {
      status: HttpStatusCode.MethodNotAllowed,
    })
  }
  const filePath = ResolveFilePath.resolveFilePath(pathName, webViewRoot)
  const isHtml = filePath.endsWith('index.html')
  let response
  if (isHtml) {
    response = await HandleIndexHtml.handleIndexHtml(filePath, contentSecurityPolicy, iframeContent)
  } else if (filePath.endsWith('preview-injected.js')) {
    response = await HandlePreviewInjected.handlePreviewInjected()
  } else {
    response = await HandleOther.handleOther(filePath, range)
  }

  if (method === HttpMethod.Head) {
    return new Response(null, {
      status: response.status,
      headers: response.headers,
    })
  }
  return response
}
