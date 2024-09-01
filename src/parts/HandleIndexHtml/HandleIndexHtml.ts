import { readFile } from 'node:fs/promises'
import * as GetContentSecurityPolicy from '../GetContentSecurityPolicy/GetContentSecurityPolicy.ts'
import * as GetContentType from '../GetContentType/GetContentType.ts'
import * as InjectPreviewScript from '../InjectPreviewScript/InjectPreviewScript.ts'

export const handleIndexHtml = async (filePath: string, frameAncestors: string): Promise<Response> => {
  try {
    const csp = GetContentSecurityPolicy.getContentSecurityPolicy([
      "default-src 'none'",
      "script-src 'self'",
      "style-src 'self'",
      `frame-ancestors ${frameAncestors}`,
    ])
    const contentType = GetContentType.getContentType(filePath)
    const content = await readFile(filePath, 'utf8')
    const newContent = InjectPreviewScript.injectPreviewScript(content)
    return new Response(newContent, {
      headers: {
        'Cross-Origin-Resource-Policy': 'cross-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Content-Security-Policy': csp,
        'Content-Type': contentType,
      },
    })
  } catch (error) {
    console.error(`[preview-server] ${error}`)
    return new Response('not found')
  }
}
