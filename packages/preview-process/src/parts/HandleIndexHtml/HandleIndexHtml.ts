import type { HandlerOptions } from '../HandlerOptions/HandlerOptions.ts'
import type { RequestOptions } from '../RequestOptions/RequestOptions.ts'
import * as CrossOriginEmbedderPolicy from '../CrossOriginEmbedderPolicy/CrossOriginEmbedderPolicy.ts'
import * as CrossOriginResourcePolicy from '../CrossOriginResourcePolicy/CrossOriginResourcePolicy.ts'
import * as GetContentSecurityPolicyDocument from '../GetContentSecurityPolicyDocument/GetContentSecurityPolicyDocument.ts'
import * as GetContentType from '../GetContentType/GetContentType.ts'
import * as HttpHeader from '../HttpHeader/HttpHeader.ts'
import * as MatchesEtag from '../MatchesEtag/MatchesEtag.ts'
import { NotFoundResponse } from '../Responses/NotFoundResponse.ts'
import { NotModifiedResponse } from '../Responses/NotModifiedResponse.ts'
import { ServerErrorResponse } from '../Responses/ServerErrorResponse.ts'
import { createHash } from 'node:crypto'

const generateEtag = (content: string): string => {
  const hash = createHash('sha1')
  hash.update(content)
  return `W/"${hash.digest('hex')}"`
}

export const handleIndexHtml = async (request: RequestOptions, options: HandlerOptions): Promise<Response> => {
  try {
    if (!options.iframeContent) {
      throw new Error('iframe content is required')
    }

    const contentType = GetContentType.getContentType('/test/index.html')
    const csp = GetContentSecurityPolicyDocument.getContentSecurityPolicyDocument(options.contentSecurityPolicy)
    const headers = {
      [HttpHeader.CrossOriginResourcePolicy]: CrossOriginResourcePolicy.CrossOrigin,
      [HttpHeader.CrossOriginEmbedderPolicy]: CrossOriginEmbedderPolicy.value,
      [HttpHeader.ContentSecurityPolicy]: csp,
      [HttpHeader.ContentType]: contentType,
    }

    if (options.etag) {
      const etag = generateEtag(options.iframeContent)
      if (MatchesEtag.matchesEtag(request, etag)) {
        return new NotModifiedResponse(etag, headers)
      }
      // @ts-ignore
      headers[HttpHeader.Etag] = etag
    }

    return new Response(options.iframeContent, {
      headers,
    })
  } catch (error) {
    console.error(`[preview-server] ${error}`)
    return new ServerErrorResponse()
  }
}
