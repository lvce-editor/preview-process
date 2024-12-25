import type { RouteHandler } from '../RouteHandler/RouteHandler.ts'
import * as HandleIndexHtml from '../HandleIndexHtml/HandleIndexHtml.ts'
import * as HandleOther from '../HandleOther/HandleOther.ts'
import * as HandlePreviewInjected from '../HandlePreviewInjected/HandlePreviewInjected.ts'

export const routes: RouteHandler[] = [
  {
    pattern: /index\.html$/,
    handler: HandleIndexHtml.handleIndexHtml,
  },
  {
    pattern: /preview-injected\.js$/,
    handler: HandlePreviewInjected.handlePreviewInjected,
  },
  {
    pattern: /.*/,
    handler: HandleOther.handleOther,
  },
]
