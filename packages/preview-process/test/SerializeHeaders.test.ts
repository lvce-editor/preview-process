import { expect, test } from '@jest/globals'
import * as SerializeHeaders from '../src/parts/SerializeHeaders/SerializeHeaders.ts'

test('serializeHeaders - empty headers', () => {
  const headers = new Headers()
  expect(SerializeHeaders.serializeHeaders(headers)).toEqual({})
})

test('serializeHeaders - single header', () => {
  const headers = new Headers()
  headers.set('Content-Type', 'text/plain')
  expect(SerializeHeaders.serializeHeaders(headers)).toEqual({
    'Content-Type': 'text/plain',
  })
})

test('serializeHeaders - multiple headers', () => {
  const headers = new Headers()
  headers.set('Content-Type', 'text/plain')
  headers.set('ETag', '"123"')
  headers.set('Cross-Origin-Resource-Policy', 'same-origin')
  expect(SerializeHeaders.serializeHeaders(headers)).toEqual({
    'Content-Type': 'text/plain',
    Etag: '"123"',
    'Cross-Origin-Resource-Policy': 'same-origin',
  })
})

test('serializeHeaders - case insensitive', () => {
  const headers = new Headers()
  headers.set('content-type', 'text/plain')
  expect(SerializeHeaders.serializeHeaders(headers)).toEqual({
    'Content-Type': 'text/plain',
  })
})

test('serializeHeaders - multiple values for same header', () => {
  const headers = new Headers()
  headers.append('X-Custom', 'value1')
  headers.append('X-Custom', 'value2')
  expect(SerializeHeaders.serializeHeaders(headers)).toEqual({
    'X-Custom': 'value1, value2',
  })
})
