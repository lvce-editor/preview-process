import { readFile } from 'node:fs/promises'
import * as GetElectronFileResponseAbsolutePath from '../GetElectronFileResponseAbsolutePath/GetElectronFileResponseAbsolutePath.ts'
import * as GetHeaders from '../GetHeaders/GetHeaders.ts'
import * as HttpMethod from '../HttpMethod/HttpMethod.ts'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.ts'

const defaultHeaders = {
  'Cross-Origin-Resource-Policy': 'cross-origin',
  'Cross-Origin-Embedder-Policy': 'require-corp',
}

export const getResponse = async (method: string, url: string) => {
  // TODO allow head requests
  if (method !== HttpMethod.Get) {
    return {
      body: 'Method not allowed',
      init: {
        status: HttpStatusCode.MethodNotAllowed,
        headers: defaultHeaders,
      },
    }
  }
  const absolutePath = GetElectronFileResponseAbsolutePath.getElectronFileResponseAbsolutePath(url)
  if (!absolutePath) {
    return {
      body: 'not found',
      init: {
        status: HttpStatusCode.NotFound,
        headers: defaultHeaders,
      },
    }
  }
  const content = await readFile(absolutePath)
  const headers = GetHeaders.getHeaders(absolutePath)
  return {
    body: content,
    init: {
      status: HttpStatusCode.Ok,
      headers,
    },
  }
}
