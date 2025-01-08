import { apiFactory } from '../ApiFactory/ApiFactory.ts'

export const main = () => {
  const apiKey = 'lvceRpc'
  // @ts-ignore
  globalThis[apiKey] = apiFactory
}
