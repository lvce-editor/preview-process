import { readFile } from 'node:fs/promises'
import type { HandlerOptions } from '../HandlerOptions/HandlerOptions.ts'
import * as CrossOriginEmbedderPolicy from '../CrossOriginEmbedderPolicy/CrossOriginEmbedderPolicy.ts'
import * as CrossOriginResourcePolicy from '../CrossOriginResourcePolicy/CrossOriginResourcePolicy.ts'
import * as GetContentSecurityPolicyDocument from '../GetContentSecurityPolicyDocument/GetContentSecurityPolicyDocument.ts'
import * as GetContentType from '../GetContentType/GetContentType.ts'
import * as HttpHeader from '../HttpHeader/HttpHeader.ts'
import * as InjectPreviewScript from '../InjectPreviewScript/InjectPreviewScript.ts'
import { NotFoundResponse } from '../Responses/NotFoundResponse.ts'

export const handleIndexHtml = async (filePath: string, options: HandlerOptions): Promise<Response> => {
  try {
    const csp = GetContentSecurityPolicyDocument.getContentSecurityPolicyDocument(options.contentSecurityPolicy)
    const contentType = GetContentType.getContentType(filePath)
    const headers = {
      [HttpHeader.CrossOriginResourcePolicy]: CrossOriginResourcePolicy.CrossOrigin,
      [HttpHeader.CrossOriginEmbedderPolicy]: CrossOriginEmbedderPolicy.value,
      [HttpHeader.ContentSecurityPolicy]: csp,
      [HttpHeader.ContentType]: contentType,
    }
    if (options.iframeContent) {
      return new Response(options.iframeContent, {
        headers,
      })
    }
    // deprecated
    const content = await readFile(filePath, 'utf8')
    const newContent = InjectPreviewScript.injectPreviewScript(content)
    return new Response(newContent, {
      headers,
    })
  } catch (error) {
    console.error(`[preview-server] ${error}`)
    return new NotFoundResponse()
  }
}
