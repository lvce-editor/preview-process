import { createHash } from 'node:crypto'

export const generateEtag = (content: string): string => {
  const hash = createHash('sha1')
  hash.update(content)
  return `W/"${hash.digest('hex')}"`
}
