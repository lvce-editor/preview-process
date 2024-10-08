import {
  IpcChildWithElectronMessagePort,
  IpcChildWithElectronUtilityProcess,
  IpcChildWithNodeForkedProcess,
  IpcChildWithNodeWorker,
  IpcChildWithWebSocket,
} from '@lvce-editor/ipc'
import * as IpcChildType from '../IpcChildType/IpcChildType.ts'

export const getModule = (method: number) => {
  switch (method) {
    case IpcChildType.NodeForkedProcess:
      return IpcChildWithNodeForkedProcess
    case IpcChildType.NodeWorker:
      return IpcChildWithNodeWorker
    case IpcChildType.ElectronUtilityProcess:
      return IpcChildWithElectronUtilityProcess
    case IpcChildType.ElectronMessagePort:
      return IpcChildWithElectronMessagePort
    case IpcChildType.WebSocket:
      return IpcChildWithWebSocket
    default:
      throw new Error('unexpected ipc type')
  }
}
