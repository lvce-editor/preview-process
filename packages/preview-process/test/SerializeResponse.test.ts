import { expect, test } from '@jest/globals'
import * as SerializeResponse from '../src/parts/SerializeResponse/SerializeResponse.ts'

test.skip('serializeResponse - with text content', async () => {
  const response = new Response('test content', {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cross-Origin-Resource-Policy': 'same-origin',
    },
  })
  const serialized = await SerializeResponse.serializeResponse(response)
  expect(serialized).toEqual({
    body: Buffer.from('test content'),
    init: {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Cross-Origin-Resource-Policy': 'same-origin',
      },
    },
  })
})

test.skip('serializeResponse - with binary content', async () => {
  const binaryData = new Uint8Array([1, 2, 3, 4])
  const response = new Response(binaryData, {
    status: 200,
    headers: {
      'Content-Type': 'application/octet-stream',
    },
  })
  const serialized = await SerializeResponse.serializeResponse(response)
  expect(serialized).toEqual({
    body: Buffer.from([1, 2, 3, 4]),
    init: {
      status: 200,
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    },
  })
})

test.skip('serializeResponse - with no content', async () => {
  const response = new Response(null, {
    status: 304,
    headers: {
      ETag: '"123"',
    },
  })
  const serialized = await SerializeResponse.serializeResponse(response)
  expect(serialized).toEqual({
    body: Buffer.from([]),
    init: {
      status: 304,
      headers: {
        ETag: '"123"',
      },
    },
  })
})

test.skip('serializeResponse - with error status', async () => {
  const response = new Response('Not Found', {
    status: 404,
    headers: {
      'Content-Type': 'text/plain',
    },
  })
  const serialized = await SerializeResponse.serializeResponse(response)
  expect(serialized).toEqual({
    body: Buffer.from('Not Found'),
    init: {
      status: 404,
      headers: {
        'Content-Type': 'text/plain',
      },
    },
  })
})
