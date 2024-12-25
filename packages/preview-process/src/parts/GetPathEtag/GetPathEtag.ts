import { stat } from 'node:fs/promises'
import * as GetEtag from '../GetEtag/GetEtag.ts'

export const getPathEtag = async (absolutePath: string): Promise<string> => {
  let stats = await stat(absolutePath)
  if (stats.isDirectory()) {
    absolutePath += '/index.html'
    stats = await stat(absolutePath)
  }
  const etag = GetEtag.getEtag(stats)
  return etag
}
