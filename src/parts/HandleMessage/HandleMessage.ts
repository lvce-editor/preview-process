import * as Callback from '../Callback/Callback.ts'
import * as Command from '../Command/Command.ts'
import * as JsonRpc from '../JsonRpc/JsonRpc.ts'

const prepare = (error: any) => {
  return error
}

const requiresSocket = (method: string) => {
  return false
}

const logError = (error: any) => {
  // error is already logged in parent process
}

export const handleMessage = async (event: any) => {
  return JsonRpc.handleJsonRpcMessage(
    event.target,
    event.data,
    Command.execute,
    Callback.resolve,
    prepare,
    logError,
    requiresSocket,
  )
}
