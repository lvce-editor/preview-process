import { WebSocket as WS } from 'ws'

export interface WebSocketMessage {
  id: number
  method: string
  params: Record<string, any>
}

export const connect = async (url: string): Promise<WS> => {
  const ws = new WS(url)
  await new Promise((resolve) => ws.once('open', resolve))
  return ws
}

export const invoke = async (ws: WS, method: string, params: Record<string, any>): Promise<any> => {
  const { promise, resolve, reject } = Promise.withResolvers<any>()

  ws.once('message', (data): void => {
    const response = JSON.parse(data.toString())
    if (response.result.exceptionDetails) {
      reject(new Error(response.result.exceptionDetails.exception.description))
    } else {
      resolve(response.result)
    }
  })

  ws.send(
    JSON.stringify({
      id: 1,
      method,
      params,
    }),
  )

  return promise
}

export const dispose = (ws: WS): void => {
  ws.close()
}
