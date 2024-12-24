import { expect, jest, test } from '@jest/globals'
import { MessageChannel } from 'node:worker_threads'

jest.unstable_mockModule('@lvce-editor/rpc', () => {
  return {
    ElectronMessagePortRpcClient: {
      create: jest.fn(),
    },
  }
})

const HandleElectronMessagePort = await import('../src/parts/HandleElectronMessagePort/HandleElectronMessagePort.ts')
const RpcModule = await import('@lvce-editor/rpc')

test('handleElectronMessagePort', async () => {
  const { port1, port2 } = new MessageChannel()

  await HandleElectronMessagePort.handleElectronMessagePort(port1)

  expect(RpcModule.ElectronMessagePortRpcClient.create).toHaveBeenCalledWith({
    messagePort: port1,
    commandMap: expect.any(Object),
  })

  port1.close()
  port2.close()
})

test('handleElectronMessagePort - error', async () => {
  const { port1, port2 } = new MessageChannel()
  jest.spyOn(RpcModule.ElectronMessagePortRpcClient, 'create').mockRejectedValue(new Error('Failed to create RPC client'))

  await expect(HandleElectronMessagePort.handleElectronMessagePort(port1)).rejects.toThrow('Failed to create RPC client')

  port1.close()
  port2.close()
})
