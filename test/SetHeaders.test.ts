import { expect, jest, test } from '@jest/globals'
import * as SetHeaders from '../src/parts/SetHeaders/SetHeaders.js'

test('setHeaders', () => {
  const headers = {
    A: '1',
  }
  const response = {
    setHeader: jest.fn(),
  }
  SetHeaders.setHeaders(response, headers)
  expect(response.setHeader).toHaveBeenCalledTimes(1)
  expect(response.setHeader).toHaveBeenCalledWith('A', '1')
})
