import * as GetInfo from '../GetInfo/GetInfo.ts'
import * as GetPathName from '../GetPathName/GetPathName.ts'
import * as GetResponse from '../GetResponse/GetResponse.ts'
import type { HandlerOptions } from '../HandlerOptions/HandlerOptions.ts'

interface ElectronResponse {
  readonly body: any
  readonly init: {
    readonly status: number
    readonly headers: any
  }
}

const serializeHeaders = (headers: Response['headers']): any => {
  const serialized = Object.create(null)
  for (const [key, value] of headers) {
    serialized[key] = value
  }
  return serialized
}

const serializeResponse = async (response: Response): Promise<ElectronResponse> => {
  const buffer = await response.arrayBuffer()
  return {
    body: buffer,
    init: {
      status: response.status,
      headers: serializeHeaders(response.headers),
    },
  }
}

export const getResponse = async (method: string, url: string): Promise<ElectronResponse> => {
  const info = GetInfo.getInfo(url)
  const pathName = GetPathName.getPathName2(url)
  const requestOptions = {
    method,
    path: pathName,
    headers: {},
  }
  const handlerOptions: HandlerOptions = {
    contentSecurityPolicy: info.contentSecurityPolicy,
    iframeContent: info.iframeContent,
    stream: false,
    webViewRoot: info.webViewRoot,
  }
  const jsResponse = await GetResponse.getResponse(requestOptions, handlerOptions)
  const serializedResponse = await serializeResponse(jsResponse)
  return serializedResponse
}
