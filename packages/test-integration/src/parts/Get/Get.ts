export interface GetOptions {
  headers?: Record<string, string>
}

export const get = async (url: string, options: GetOptions = {}) => {
  const response = await fetch(url, {
    headers: options.headers,
  })
  return response
}
