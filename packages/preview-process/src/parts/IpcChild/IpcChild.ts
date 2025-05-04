import type { Rpc } from '@lvce-editor/rpc'
import * as IpcChildModule from '../IpcChildModule/IpcChildModule.ts'

export const listen = async ({ method, ...params }: { method: number; [key: string]: any }): Promise<Rpc> => {
  const fn = IpcChildModule.getModule(method)
  // @ts-ignore
  const rpc = await create(params)
  // @ts-ignore
  return rpc
}
