export const injectPreviewScript = (html: string): string => {
  const injectedCode = '<script type="module" src="/preview-injected.js"></script>\n'
  const titleEndIndex = html.indexOf('</title>')
  const newHtml = html.slice(0, titleEndIndex + '</title>'.length) + '\n' + injectedCode + html.slice(titleEndIndex)
  return newHtml
}
