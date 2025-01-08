import * as Callback from '../Callback/Callback.ts'

let commandMap: any = {}
let port: any = undefined

const callbacks = Object.create(null)

const isJsonRpcResponse = (message: any) => {
  return 'result' in message || 'error' in message
}

const handleMessage = async (event: any) => {
  const message = event.data
  if (isJsonRpcResponse(message)) {
    const fn = callbacks[message.id]
    delete callbacks[message.id]
    fn(message.result)
    return
  }
  const { method, params } = message
  const fn = commandMap[method]
  if (!fn) {
    throw new Error(`command not found ${method}`)
  }
  const result = await fn(...params)
  if (message.id) {
    event.target.postMessage({
      jsonrpc: '2.0',
      id: message.id,
      result,
    })
  }
}

const handleMessageFromTestPort = (event: any) => {
  // TODO invoke test function and send back result
  const { data, target } = event
  const { method, params, id } = data
  if (method === 'createObjectUrl') {
    const blob = params[0]
    const url = URL.createObjectURL(blob)
    target.postMessage({
      jsonrpc: '2.0',
      id,
      result: url,
    })
  } else {
    throw new Error('unsupported method')
  }
}

const handleWindowMessage = (event: any) => {
  const { data } = event
  const message = data
  const innerPort = message.params[0]
  const portType = message.params[1]
  if (portType === 'test') {
    innerPort.onmessage = handleMessageFromTestPort
    innerPort.postMessage('ready')
  } else {
    innerPort.onmessage = handleMessage
    innerPort.postMessage('ready')
    port = innerPort
  }
}

window.addEventListener('message', handleWindowMessage)

export const apiFactory = (value: any) => {
  commandMap = value
  return {
    async invoke(method: string, ...params: any[]) {
      const { id, promise } = Callback.registerPromise()
      port.postMessage({
        jsonrpc: '2.0',
        id,
        method,
        params,
      })
      const response = await promise
      // @ts-ignore
      if (response && 'error' in response) {
        // @ts-ignore
        throw new Error(response.error.message)
      }
      // TODO unwrap jsonrpc result
      return response
    },
  }
}
