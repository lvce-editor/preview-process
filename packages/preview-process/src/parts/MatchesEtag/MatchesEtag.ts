import * as HttpHeader from '../HttpHeader/HttpHeader.ts'

export const matchesEtag = (request: any, etag: string): boolean => {
  return request.headers[HttpHeader.IfNotMatch] === etag
}
