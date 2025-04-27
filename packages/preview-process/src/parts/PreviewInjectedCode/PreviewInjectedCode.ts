import * as fs from 'node:fs'
import { join } from 'node:path'
import * as Root from '../Root/Root.ts'

const injectedCodePath = join(
  Root.root,
  'node_modules',
  '@lvce-editor',
  'preview-injected-code',
  'dist',
  'previewInjectedCodeMain.js',
)

export const getPreviewInjectedCode = (): string => {
  const injectedCode = fs.readFileSync(injectedCodePath, 'utf8')
  return injectedCode
}
