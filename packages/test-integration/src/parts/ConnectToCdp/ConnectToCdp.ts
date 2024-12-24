import CDP from 'chrome-remote-interface'
import waitOn from 'wait-on'

export const connectToCdp = async (debugPort: number): Promise<CDP.Client> => {
  console.log('before wait')
  console.log({ debugPort })
  await waitOn({
    resources: [`http://localhost:${debugPort}/json/list`],
  })
  console.log('after wait')
  const client = await CDP({
    host: 'localhost',
    port: debugPort,
  })
  await client.Runtime.enable()
  return client
}
