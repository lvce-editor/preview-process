export const getPathName = (request: any): string => {
  const { pathname } = new URL(request.url || '', `https://${request.headers.host}`)
  return pathname
}

export const getPathName2 = (url: string): string => {
  try {
    const p = new URL(url).pathname
    return p
  } catch {
    return ''
  }
}
