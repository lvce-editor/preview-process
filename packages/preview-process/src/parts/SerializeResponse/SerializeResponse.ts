import * as SerializeHeaders from '../SerializeHeaders/SerializeHeaders.ts'

export const serializeResponse = async (response: Response): Promise<any> => {
  const body = await response.arrayBuffer()
  return {
    body: Buffer.from(body),
    init: {
      headers: SerializeHeaders.serializeHeaders(response.headers),
      status: response.status,
    },
  }
}
