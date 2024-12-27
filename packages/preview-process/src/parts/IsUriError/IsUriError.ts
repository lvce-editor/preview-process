export const isUriError = (error: unknown): boolean => {
  return Boolean(error && error instanceof URIError)
}
