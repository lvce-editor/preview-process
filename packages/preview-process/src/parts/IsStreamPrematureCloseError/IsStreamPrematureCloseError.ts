import * as ErrorCodes from '../ErrorCodes/ErrorCodes.ts'

export const isStreamPrematureCloseError = (error: any): boolean => {
  return error && error.code === ErrorCodes.ERR_STREAM_PREMATURE_CLOSE
}
