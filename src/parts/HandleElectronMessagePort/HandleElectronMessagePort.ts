import { ElectronMessagePortRpcClient } from '@lvce-editor/rpc'
import * as CommandMap from '../CommandMap/CommandMap.ts'

export const handleElectronMessagePort = async (messagePort: any) => {
  await ElectronMessagePortRpcClient.listen({
    messagePort,
    commandMap: CommandMap.commandMap,
  })
}
