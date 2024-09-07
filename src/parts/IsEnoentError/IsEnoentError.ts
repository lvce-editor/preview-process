import * as ErrorCodes from '../ErrorCodes/ErrorCodes.ts'

export const isEnoentError = (error: unknown) => {
  // @ts-ignore
  return error && error.code && error.code === ErrorCodes.ENOENT
}
