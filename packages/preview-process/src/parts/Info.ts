export interface Info {
  readonly webViewRoot: string
  readonly webViewId: string
  readonly contentSecurityPolicy: string
  readonly iframeContent: string
  readonly remotePathPrefix?: string
}
