import * as HttpHeader from '../HttpHeader/HttpHeader.ts'

export const defaultHeaders = {
  [HttpHeader.CrossOriginEmbedderPolicy]: 'require-corp',
  [HttpHeader.CrossOriginResourcePolicy]: 'cross-origin',
}
