import { expect, test } from '@jest/globals'
import * as SerializeResponse from '../src/parts/SerializeResponse/SerializeResponse.ts'

test('serializeResponse - with text content', async () => {
  const response = new Response('test content', {
    headers: {
      'Content-Type': 'text/plain',
      'Cross-Origin-Resource-Policy': 'same-origin',
    },
    status: 200,
  })
  const serialized = await SerializeResponse.serializeResponse(response)
  expect(serialized).toEqual({
    body: Buffer.from('test content'),
    init: {
      headers: {
        'Content-Type': 'text/plain',
        'Cross-Origin-Resource-Policy': 'same-origin',
      },
      status: 200,
    },
  })
})

test('serializeResponse - with binary content', async () => {
  const binaryData = new Uint8Array([1, 2, 3, 4])
  const response = new Response(binaryData, {
    headers: {
      'Content-Type': 'application/octet-stream',
    },
    status: 200,
  })
  const serialized = await SerializeResponse.serializeResponse(response)
  expect(serialized).toEqual({
    body: Buffer.from([1, 2, 3, 4]),
    init: {
      headers: {
        'Content-Type': 'application/octet-stream',
      },
      status: 200,
    },
  })
})

test('serializeResponse - with no content', async () => {
  const response = new Response(null, {
    headers: {
      ETag: '"123"',
    },
    status: 304,
  })
  const serialized = await SerializeResponse.serializeResponse(response)
  expect(serialized).toEqual({
    body: Buffer.from([]),
    init: {
      headers: {
        ETag: '"123"',
      },
      status: 304,
    },
  })
})

test('serializeResponse - with error status', async () => {
  const response = new Response('Not Found', {
    headers: {
      'Content-Type': 'text/plain',
    },
    status: 404,
  })
  const serialized = await SerializeResponse.serializeResponse(response)
  expect(serialized).toEqual({
    body: Buffer.from('Not Found'),
    init: {
      headers: {
        'Content-Type': 'text/plain',
      },
      status: 404,
    },
  })
})
