import { readFile } from 'node:fs/promises'
import * as GetContentSecurityPolicyDocument from '../GetContentSecurityPolicyDocument/GetContentSecurityPolicyDocument.ts'
import * as GetContentType from '../GetContentType/GetContentType.ts'
import * as HttpHeader from '../HttpHeader/HttpHeader.ts'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.ts'
import * as InjectPreviewScript from '../InjectPreviewScript/InjectPreviewScript.ts'

export const handleIndexHtml = async (
  filePath: string,
  frameAncestors: string,
  contentSecurityPolicy: string,
): Promise<Response> => {
  try {
    const csp = GetContentSecurityPolicyDocument.getContentSecurityPolicyDocument(frameAncestors, contentSecurityPolicy)
    const contentType = GetContentType.getContentType(filePath)
    const content = await readFile(filePath, 'utf8')
    const newContent = InjectPreviewScript.injectPreviewScript(content)
    return new Response(newContent, {
      headers: {
        [HttpHeader.CrossOriginResourcePolicy]: 'cross-origin',
        [HttpHeader.CrossOriginEmbedderPolicy]: 'require-corp',
        [HttpHeader.ContentSecurityPolicy]: csp,
        [HttpHeader.ContentType]: contentType,
      },
    })
  } catch (error) {
    console.error(`[preview-server] ${error}`)
    return new Response('not found', {
      status: HttpStatusCode.NotFound,
    })
  }
}
