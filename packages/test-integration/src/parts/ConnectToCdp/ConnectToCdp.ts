import CDP from 'chrome-remote-interface'
import waitOn from 'wait-on'

export const connectToCdp = async (debugPort: number): Promise<CDP.Client> => {
  await waitOn({
    resources: [`http://localhost:${debugPort}`],
  })
  const client = await CDP({
    host: 'localhost',
    port: debugPort,
  })
  await client.Runtime.enable()
  return client
}
