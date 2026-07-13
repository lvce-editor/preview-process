import type { RouteHandler } from '../RouteHandler/RouteHandler.ts'
import * as HandleIndexHtml from '../HandleIndexHtml/HandleIndexHtml.ts'
import * as HandleOther from '../HandleOther/HandleOther.ts'
import * as HandlePreviewInjected from '../HandlePreviewInjected/HandlePreviewInjected.ts'

export const routes: RouteHandler[] = [
  {
    handler: HandleIndexHtml.handleIndexHtml,
    pattern: /index\.html$/,
  },
  {
    handler: HandlePreviewInjected.handlePreviewInjected,
    pattern: /preview-injected\.js$/,
  },
  {
    handler: HandleOther.handleOther,
    pattern: /.*/,
  },
]
