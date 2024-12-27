interface GetOptions {
  headers?: Record<string, string>
  signal?: AbortSignal
}

export const get = async (url: string, options: GetOptions = {}): Promise<Response> => {
  const { headers = {}, signal } = options
  const response = await fetch(url, {
    headers,
    signal,
  })
  return response
}
