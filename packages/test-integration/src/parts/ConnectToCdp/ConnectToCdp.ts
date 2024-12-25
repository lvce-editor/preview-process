import CDP from 'chrome-remote-interface'
import { setTimeout } from 'timers/promises'

export const connectToCdp = async (debugPort: number): Promise<CDP.Client> => {
  const timeout = 15000
  await setTimeout(timeout)
  const client = await CDP({
    host: 'localhost',
    port: debugPort,
  })
  await client.Runtime.enable()
  return client
}
