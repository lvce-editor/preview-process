import { expect, jest, test } from '@jest/globals'
import * as WaitForServerToBeReady from '../src/parts/WaitForServerToBeReady/WaitForServerToBeReady.ts'

test('waitForServerToBeReady', async () => {
  const mockServer = {
    listen: jest.fn((port, callback) => {
      // @ts-ignore
      callback()
    }),
  }
  const port = '3000'
  // @ts-ignore
  await WaitForServerToBeReady.waitForServerToBeReady(mockServer, port)
  expect(mockServer.listen).toHaveBeenCalledTimes(1)
  expect(mockServer.listen).toHaveBeenCalledWith(port, expect.any(Function))
})
