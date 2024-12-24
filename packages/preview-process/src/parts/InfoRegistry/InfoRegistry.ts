import type { Info } from '../Info.ts'

interface State {
  [key: string]: Info
}

const infos: State = Object.create(null)

export const set = (webViewId: string, info: Info): void => {
  infos[webViewId] = info
}

export const get = (webViewId: string): Info => {
  return infos[webViewId]
}
