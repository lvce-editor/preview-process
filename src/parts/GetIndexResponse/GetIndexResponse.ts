import type { Info } from '../Info.ts'
import * as GetHeaders from '../GetHeaders/GetHeaders.ts'
import * as HttpHeader from '../HttpHeader/HttpHeader.ts'

export const getIndexResponse = async (info: Info): Promise<any> => {
  const headers = GetHeaders.getHeaders('/test/index.html')
  return {
    body: info.iframeContent,
    init: {
      status: 200,
      headers: {
        ...headers,
        [HttpHeader.ContentSecurityPolicy]: info.contentSecurityPolicy,
      },
    },
  }
}
