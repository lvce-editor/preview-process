import CDP from 'chrome-remote-interface'
import waitPort from 'wait-port'

export const connectToCdp = async (debugPort: number): Promise<CDP.Client> => {
  try {
    await waitPort({
      port: debugPort,
      host: '::1',
      output: 'silent',
    })
    const client = await CDP({
      host: '::1',
      port: debugPort,
    })
    await client.Runtime.enable()
    return client
  } catch {
    await waitPort({
      port: debugPort,
      host: '127.0.0.1',
      output: 'silent',
    })
    const client = await CDP({
      host: '127.0.0.1',
      port: debugPort,
    })
    await client.Runtime.enable()
    return client
  }
}
