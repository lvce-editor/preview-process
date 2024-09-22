let commandMap = {}
let port
let id = 0

const createId = () => {
  return ++id
}
const callbacks = Object.create(null)

const isJsonRpcResponse = (message) => {
  return 'result' in message || 'error' in message
}

const handleMessage = async (event) => {
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
    throw new Error('command not found ${method}')
  }
  const result = await fn(...params)
}

const handleMessageFromTestPort = (event) => {
  // TODO invoke test function and send back result
}

const handleWindowMessage = (event) => {
  const { data } = event
  const message = data
  port = message.params[0]
  const portType = message.params[1]
  if (portType === 'test') {
    port.onmessage = handleMessageFromTestPort
    port.postMessage('ready')
  } else {
    port.onmessage = handleMessage
    port.postMessage('ready')
  }
}

window.addEventListener('message', handleWindowMessage)

const withResolvers = () => {
  let _resolve
  const promise = new Promise((resolve) => {
    _resolve = resolve
  })
  return {
    resolve: _resolve,
    promise,
  }
}

const registerPromise = () => {
  const id = createId()
  const { resolve, promise } = withResolvers()
  callbacks[id] = resolve
  return {
    id,
    promise,
  }
}

globalThis.lvceRpc = (value) => {
  commandMap = value
  return {
    async invoke(method, ...params) {
      const { id, promise } = registerPromise()
      port.postMessage({
        jsonrpc: '2.0',
        id,
        method,
        params,
      })
      const response = await promise
      // TODO unwrap jsonrpc result
      return response
    },
  }
}
