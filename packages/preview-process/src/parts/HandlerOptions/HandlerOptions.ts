export interface HandlerOptions {
  readonly contentSecurityPolicy: string
  readonly etag: boolean
  readonly iframeContent: string
  readonly remotePathPrefix: string
  readonly stream: boolean
  readonly webViewRoot: string
}
