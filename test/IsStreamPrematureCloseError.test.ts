import { expect, test } from '@jest/globals'
import * as ErrorCodes from '../src/parts/ErrorCodes/ErrorCodes.ts'
import * as IsStreamPrematureCloseError from '../src/parts/IsStreamPrematureCloseError/IsStreamPrematureCloseError.ts'

test('isStreamPrematureCloseError - when error is undefined', () => {
  expect(IsStreamPrematureCloseError.isStreamPrematureCloseError(undefined)).toBe(undefined)
})

test('isStreamPrematureCloseError - when error is null', () => {
  expect(IsStreamPrematureCloseError.isStreamPrematureCloseError(null)).toBe(null)
})

test('isStreamPrematureCloseError - when error has no code', () => {
  expect(IsStreamPrematureCloseError.isStreamPrematureCloseError({})).toBe(false)
})

test('isStreamPrematureCloseError - when error has different code', () => {
  expect(IsStreamPrematureCloseError.isStreamPrematureCloseError({ code: 'DIFFERENT_ERROR' })).toBe(false)
})

test('isStreamPrematureCloseError - when error is stream premature close error', () => {
  expect(
    IsStreamPrematureCloseError.isStreamPrematureCloseError({
      code: ErrorCodes.ERR_STREAM_PREMATURE_CLOSE,
    }),
  ).toBe(true)
})
