export const injectPreviewScript = (html: string): string => {
  // TODO this should already come from iframe worker
  const injectedCode = '<script type="module" src="/preview-injected.js"></script>\n'
  const titleEndIndex = html.indexOf('</title>')
  const newHtml = html.slice(0, titleEndIndex + '</title>'.length) + '\n' + injectedCode + html.slice(titleEndIndex)
  return newHtml
}
