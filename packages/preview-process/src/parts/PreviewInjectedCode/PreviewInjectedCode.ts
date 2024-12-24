import * as fs from 'node:fs'
import { join } from 'node:path'
import * as Root from '../Root/Root.ts'

const injectedCodePath = join(Root.root, 'files', 'previewInjectedCode.js')

export const injectedCode = fs.readFileSync(injectedCodePath, 'utf8')
