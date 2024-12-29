import type { Info } from '../Info.ts'
import * as InfoRegistry from '../InfoRegistry/InfoRegistry.ts'

export const setInfo2 = (options: Info): void => {
  InfoRegistry.set(options.webViewId, options)
}
