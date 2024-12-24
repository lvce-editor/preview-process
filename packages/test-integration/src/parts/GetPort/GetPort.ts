import getPortModule from 'get-port'

export const getPort = (): Promise<number> => {
  return getPortModule()
}
