import type { HandlerOptions } from '../HandlerOptions/HandlerOptions.ts'
import type { RequestOptions } from '../RequestOptions/RequestOptions.ts'
import * as CrossOriginEmbedderPolicy from '../CrossOriginEmbedderPolicy/CrossOriginEmbedderPolicy.ts'
import * as CrossOriginResourcePolicy from '../CrossOriginResourcePolicy/CrossOriginResourcePolicy.ts'
import * as GetContentSecurityPolicyDocument from '../GetContentSecurityPolicyDocument/GetContentSecurityPolicyDocument.ts'
import * as GetContentType from '../GetContentType/GetContentType.ts'
import * as HttpHeader from '../HttpHeader/HttpHeader.ts'
import * as ResolveFilePath from '../ResolveFilePath/ResolveFilePath.ts'
import { NotFoundResponse } from '../Responses/NotFoundResponse.ts'

export const handleIndexHtml = async (request: RequestOptions, options: HandlerOptions): Promise<Response> => {
  const filePath = ResolveFilePath.resolveFilePath(request.path, options.webViewRoot)

  try {
    const csp = GetContentSecurityPolicyDocument.getContentSecurityPolicyDocument(options.contentSecurityPolicy)
    const contentType = GetContentType.getContentType(filePath)
    const headers = {
      [HttpHeader.CrossOriginResourcePolicy]: CrossOriginResourcePolicy.CrossOrigin,
      [HttpHeader.CrossOriginEmbedderPolicy]: CrossOriginEmbedderPolicy.value,
      [HttpHeader.ContentSecurityPolicy]: csp,
      [HttpHeader.ContentType]: contentType,
    }
    if (!options.iframeContent) {
      throw new Error(`iframe content is required`)
    }
    return new Response(options.iframeContent, {
      headers,
    })
  } catch (error) {
    console.error(`[preview-server] ${error}`)
    return new NotFoundResponse()
  }
}
