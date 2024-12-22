interface WithResolvers<T> {
  readonly resolve: () => void
  readonly promise: Promise<T>
}

export const withResolvers = <T>(): WithResolvers<T> => {
  let _resolve: any
  const promise = new Promise<T>((resolve) => {
    _resolve = resolve
  })
  return {
    resolve: _resolve!,
    promise,
  }
}
