import { VError } from '@lvce-editor/verror'
import CDP from 'chrome-remote-interface'
import waitPort from 'wait-port'

export interface CdpConnection {
  readonly Runtime: CDP.Client['Runtime']
  readonly [Symbol.dispose]: () => Promise<void>
}

export const connectToCdp = async (debugPort: number): Promise<CdpConnection> => {
  await waitPort({
    port: debugPort,
    host: 'localhost',
    output: 'silent',
    timeout: 15000,
    path: '/json/list',
  })
  const client = await CDP({
    host: 'localhost',
    port: debugPort,
  })
  await client.Runtime.enable()
  return {
    Runtime: client.Runtime,
    async [Symbol.dispose](): Promise<void> {
      try {
        await client.close()
      } catch (error) {
        throw new VError(error, `Failed to close client`)
      }
    },
  }
}
