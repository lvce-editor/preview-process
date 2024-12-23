import type { Info } from '../Info.ts'
import * as CrossOriginEmbedderPolicy from '../CrossOriginEmbedderPolicy/CrossOriginEmbedderPolicy.ts'
import * as CrossOriginOpenerPolicy from '../CrossOriginOpenerPolicy/CrossOriginOpenerPolicy.ts'
import * as CrossOriginResourcePolicy from '../CrossOriginResourcePolicy/CrossOriginResourcePolicy.ts'
import * as GetHeaders from '../GetHeaders/GetHeaders.ts'
import * as HttpHeader from '../HttpHeader/HttpHeader.ts'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.ts'

export const getIndexResponse = async (info: Info): Promise<any> => {
  const headers = GetHeaders.getHeaders('/test/index.html')
  return {
    body: info.iframeContent,
    init: {
      status: HttpStatusCode.Ok,
      headers: {
        ...headers,
        [HttpHeader.ContentSecurityPolicy]: info.contentSecurityPolicy,
        [HttpHeader.CrossOriginEmbedderPolicy]: CrossOriginEmbedderPolicy.value,
        [HttpHeader.CrossOriginOpenerPolicy]: CrossOriginOpenerPolicy.value,
        [HttpHeader.CrossOriginResourcePolicy]: CrossOriginResourcePolicy.value,
      },
    },
  }
}
