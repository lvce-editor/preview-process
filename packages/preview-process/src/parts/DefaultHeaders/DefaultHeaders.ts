import * as HttpHeader from '../HttpHeader/HttpHeader.ts'

export const defaultHeaders = {
  [HttpHeader.CrossOriginResourcePolicy]: 'cross-origin',
  [HttpHeader.CrossOriginEmbedderPolicy]: 'require-corp',
}
