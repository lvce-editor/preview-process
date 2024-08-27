import { readFile } from 'node:fs/promises'
import * as GetContentSecurityPolicy from '../GetContentSecurityPolicy/GetContentSecurityPolicy.ts'
import * as GetContentType from '../GetContentType/GetContentType.ts'
import * as SetHeaders from '../SetHeaders/SetHeaders.ts'

const injectPreviewScript = (html) => {
  const injectedCode =
    '<script type="module" src="/preview-injected.js"></script>\n'
  const titleEndIndex = html.indexOf('</title>')
  const newHtml =
    html.slice(0, titleEndIndex + '</title>'.length) +
    '\n' +
    injectedCode +
    html.slice(titleEndIndex)
  return newHtml
}

export const handleIndexHtml = async (response, filePath, frameAncestors) => {
  try {
    const csp = GetContentSecurityPolicy.getContentSecurityPolicy([
      "default-src 'none'",
      "script-src 'self'",
      `frame-ancestors ${frameAncestors}`,
    ])
    const contentType = GetContentType.getContentType(filePath)
    const content = await readFile(filePath, 'utf8')
    SetHeaders.setHeaders(response, {
      'Cross-Origin-Resource-Policy': 'cross-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Content-Security-Policy': csp,
      'Content-Type': contentType,
    })
    const newContent = injectPreviewScript(content)
    response.end(newContent)
  } catch (error) {
    console.error(`[preview-server] ${error}`)
  }
}
