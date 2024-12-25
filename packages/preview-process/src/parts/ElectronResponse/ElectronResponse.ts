export interface ElectronResponse {
  readonly body: any
  readonly init: {
    readonly status: number
    readonly headers: any
  }
}
