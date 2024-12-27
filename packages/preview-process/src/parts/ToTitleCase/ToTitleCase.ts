const SPECIAL_CASES: Record<string, string> = {
  etag: 'ETag',
}

export const toTitleCase = (key: string): string => {
  const lowerKey = key.toLowerCase()
  if (SPECIAL_CASES[lowerKey]) {
    return SPECIAL_CASES[lowerKey]
  }
  return key
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('-')
}
