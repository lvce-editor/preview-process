import { extname } from 'node:path'
import * as CrossOriginEmbedderPolicy from '../CrossOriginEmbedderPolicy/CrossOriginEmbedderPolicy.ts'
import * as CrossOriginResourcePolicy from '../CrossOriginResourcePolicy/CrossOriginResourcePolicy.ts'
import * as GetMimeType from '../GetMimeType/GetMimeType.ts'
import * as HttpHeader from '../HttpHeader/HttpHeader.ts'

export const getHeaders = (absolutePath: string, etag?: string) => {
  const extension = extname(absolutePath)
  const mime = GetMimeType.getMimeType(extension)
  const headers: Record<string, string> = {
    [HttpHeader.ContentType]: mime,
  }
  if (etag) {
    headers[HttpHeader.Etag] = etag
  }
  // TODO support strong csp with webworkers
  // TODO support csp for iframes inside iframes?
  if (absolutePath.endsWith('.html')) {
    headers[HttpHeader.CrossOriginResourcePolicy] = CrossOriginResourcePolicy.value
    headers[HttpHeader.CrossOriginEmbedderPolicy] = CrossOriginEmbedderPolicy.value
  } else {
    headers[HttpHeader.CrossOriginResourcePolicy] = 'same-origin'
  }
  return {
    ...headers,
  }
}
