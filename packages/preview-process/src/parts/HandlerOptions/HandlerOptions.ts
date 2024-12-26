export interface HandlerOptions {
  readonly webViewRoot: string
  readonly contentSecurityPolicy: string
  readonly iframeContent: string
  readonly stream: boolean
  readonly etag: boolean
}
