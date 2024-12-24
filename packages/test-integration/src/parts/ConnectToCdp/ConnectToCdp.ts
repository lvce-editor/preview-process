import CDP from 'chrome-remote-interface'

export const connectToCdp = async (debugPort: number): Promise<CDP.Client> => {
  await new Promise((r) => {
    setTimeout(r, 1000)
  })

  const client = await CDP({
    host: 'localhost',
    port: debugPort,
  })
  await client.Runtime.enable()
  return client
}
