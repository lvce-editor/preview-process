export interface Info {
  readonly contentSecurityPolicy: string
  readonly iframeContent: string
  readonly remotePathPrefix?: string
  readonly webViewId: string
  readonly webViewRoot: string
}
