import * as ToTitleCase from '../ToTitleCase/ToTitleCase.ts'

export const serializeHeaders = (headers: Headers): Record<string, string> => {
  const result: Record<string, string> = {}
  for (const [key, value] of headers.entries()) {
    const normalizedKey = ToTitleCase.toTitleCase(key)
    result[normalizedKey] = value
  }
  return result
}
