export const getRoot = (): string => {
  return new URL('../../../', import.meta.url).toString()
}
