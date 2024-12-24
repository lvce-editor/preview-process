import { ElectronMessagePortRpcClient } from '@lvce-editor/rpc'
import * as WebViewProtocol from '../WebViewProtocol/WebViewProtocol.ts'

const commandMap = {
  'WebViewProtocol.getResponse': WebViewProtocol.getResponse,
}

export const handleElectronMessagePort = async (messagePort: any): Promise<void> => {
  await ElectronMessagePortRpcClient.create({
    messagePort,
    commandMap,
  })
}
