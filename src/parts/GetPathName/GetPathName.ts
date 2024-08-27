export const getPathName = (request: any) => {
  const { pathname } = new URL(
    request.url || '',
    `https://${request.headers.host}`,
  )
  return pathname
}
