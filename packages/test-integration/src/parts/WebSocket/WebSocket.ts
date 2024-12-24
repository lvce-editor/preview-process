import { WebSocket as WS } from 'ws'

export interface WebSocketMessage {
  readonly id: number
  readonly method: string
  readonly params: Record<string, any>
}

export const connect = async (url: string): Promise<WS> => {
  const ws = new WS(url)
  const { promise, resolve } = Promise.withResolvers<WS>()
  ws.once('open', () => {
    resolve(ws)
  })
  return promise
}

export const invoke = async (ws: WS, method: string, params: Record<string, any>): Promise<any> => {
  const { promise, resolve } = Promise.withResolvers<any>()

  ws.once('message', (data): void => {
    const response = JSON.parse(data.toString())
    resolve(response)
  })

  ws.send(
    JSON.stringify({
      id: 1,
      method,
      params,
    }),
  )

  const response = await promise
  if (response && response.result && response.result.exceptionDetails) {
    throw new Error(response.result.exceptionDetails.exception.description)
  }
  if (response && response.error && response.error.message) {
    throw new Error(response.error.message)
  }
  if (response && response.result && response.result.result) {
    return response.result.result
  }
  if (response && response.result) {
    return response.result
  }
  if (response) {
    return response
  }
  return response
}

export const dispose = (ws: WS): void => {
  ws.close()
}
