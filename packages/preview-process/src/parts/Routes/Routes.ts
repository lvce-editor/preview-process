import * as HandleIndexHtml from '../HandleIndexHtml/HandleIndexHtml.ts'
import * as HandleOther from '../HandleOther/HandleOther.ts'
import * as HandlePreviewInjected from '../HandlePreviewInjected/HandlePreviewInjected.ts'
import * as ResolveFilePath from '../ResolveFilePath/ResolveFilePath.ts'
import type { RouteHandler } from '../RouteHandler/RouteHandler.ts'

export const routes: RouteHandler[] = [
  {
    pattern: /index\.html$/,
    handler: async (request, options) => {
      const filePath = ResolveFilePath.resolveFilePath(request.path, options.webViewRoot)
      return HandleIndexHtml.handleIndexHtml(filePath, options)
    },
  },
  {
    pattern: /preview-injected\.js$/,
    handler: async () => HandlePreviewInjected.handlePreviewInjected(),
  },
  {
    pattern: /.*/,
    handler: async (request, options) => {
      const filePath = ResolveFilePath.resolveFilePath(request.path, options.webViewRoot)
      return HandleOther.handleOther(filePath, request)
    },
  },
]