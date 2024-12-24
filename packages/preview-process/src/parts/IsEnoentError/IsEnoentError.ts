import * as ErrorCodes from '../ErrorCodes/ErrorCodes.ts'

export const isEnoentError = (error: unknown): boolean => {
  // @ts-ignore
  return error && error.code && error.code === ErrorCodes.ENOENT
}
