export interface RequestOptions {
  readonly method: string
  // TODO this is part of headers already
  readonly range?: string
  readonly path: string
  readonly headers: any
}
