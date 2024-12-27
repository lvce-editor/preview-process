import { expect, jest, test } from '@jest/globals'
import * as WaitForServerToBeReady from '../src/parts/WaitForServerToBeReady/WaitForServerToBeReady.ts'

test('waitForServerToBeReady - success', async () => {
  const mockServer = {
    server: {
      once: jest.fn(),
      listen: jest.fn((port, callback) => {
        callback()
      }),
    },
    listen: jest.fn((port, callback) => {
      callback()
    }),
  }
  const port = '3000'
  await WaitForServerToBeReady.waitForServerToBeReady(mockServer as any, port)
  expect(mockServer.listen).toHaveBeenCalledTimes(1)
  expect(mockServer.listen).toHaveBeenCalledWith(port, expect.any(Function))
  expect(mockServer.server.once).toHaveBeenCalledWith('error', expect.any(Function))
})

test('waitForServerToBeReady - handles EADDRINUSE error', async () => {
  const error = new Error('EADDRINUSE')
  const mockServer = {
    server: {
      once: jest.fn((event, handler) => {
        if (event === 'error') {
          handler(error)
        }
      }),
      listen: jest.fn(),
    },
    listen: jest.fn(),
  }
  const port = '3000'
  await expect(WaitForServerToBeReady.waitForServerToBeReady(mockServer as any, port)).rejects.toThrow('EADDRINUSE')
  expect(mockServer.server.once).toHaveBeenCalledWith('error', expect.any(Function))
})
