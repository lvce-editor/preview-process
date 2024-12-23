import type { Info } from '../Info.ts'

interface State {
  [key: string]: Info
}

export const state: State = {
  infos: Object.create(null),
}

export const set = (webViewId: string, info: Info): void => {
  state[webViewId] = info
}

export const get = (webViewId: string): Info => {
  return state[webViewId]
}
