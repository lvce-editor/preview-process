import CDP from 'chrome-remote-interface'
import waitPort from 'wait-port'

export const connectToCdp = async (debugPort: number): Promise<CDP.Client> => {
  await waitPort({
    port: debugPort,
    host: 'localhost',
    output: 'silent',
    timeout: 15000,
  })
  const client = await CDP({
    host: 'localhost',
    port: debugPort,
  })
  await client.Runtime.enable()
  return client
}
