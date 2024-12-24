import CDP from 'chrome-remote-interface'
import waitForLocalhost from 'wait-for-localhost'

export const connectToCdp = async (debugPort: number): Promise<CDP.Client> => {
  await waitForLocalhost({ port: debugPort })
  const client = await CDP({
    host: 'localhost',
    port: debugPort,
  })
  await client.Runtime.enable()
  return client
}
