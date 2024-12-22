import { beforeEach, expect, jest, test } from '@jest/globals'
import { ServerResponse } from 'http'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/FileSystem/FileSystem.ts', () => {
  return {
    readFile: jest.fn(),
  }
})

const HandleOther = await import('../src/parts/HandleOther/HandleOther.ts')
const FileSystem = await import('../src/parts/FileSystem/FileSystem.ts')

class FileNotFoundError extends Error {
  constructor() {
    super('ENOENT: no such file')
    // @ts-ignore
    this.code = 'ENOENT'
  }
}

test('not found', async () => {
  jest.spyOn(FileSystem, 'readFile').mockRejectedValue(new FileNotFoundError())
  const range = ''
  const response = await HandleOther.handleOther('/test/not-found.txt', range)
  expect(response.status).toBe(404)
  expect(await response.text()).toBe('not found')
})

test('normal file', async () => {
  jest.spyOn(FileSystem, 'readFile').mockResolvedValue(Buffer.from('ok'))
  const range = ''
  const response = await HandleOther.handleOther('/test/not-found.txt', range)
  expect(response.status).toBe(200)
  expect(await response.text()).toBe('ok')
})
