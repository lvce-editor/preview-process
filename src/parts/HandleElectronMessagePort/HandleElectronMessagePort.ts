import { ElectronMessagePortRpcClient } from '@lvce-editor/rpc'
import * as CommandMap from '../CommandMap/CommandMap.ts'

export const handleElectronMessagePort = async (messagePort: any): Promise<void> => {
  await ElectronMessagePortRpcClient.create({
    messagePort,
    commandMap: CommandMap.commandMap,
  })
}
