export const getPathName = (request: any): string => {
  const { pathname } = new URL(request.url || '', `https://${request.headers.host}`)
  return pathname
}
