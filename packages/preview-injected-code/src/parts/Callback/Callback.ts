import { createId } from '../Id/Id.ts'

const callbacks = Object.create(null)

export const registerPromise = () => {
  const id = createId()
  const { resolve, promise } = Promise.withResolvers()
  callbacks[id] = resolve
  return {
    id,
    promise,
  }
}

export const resolve = (id: number, value: any): void => {
  const fn = callbacks[id]
  delete callbacks[id]
  fn(value)
}
