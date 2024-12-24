import { expect, jest, test } from '@jest/globals'
import { promises as fs } from 'node:fs'

jest.unstable_mockModule('node:fs/promises', () => {
  return {
    readFile: jest.fn(),
  }
})

const FileSystem = await import('../src/parts/FileSystem/FileSystem.ts')
const FsPromises = await import('node:fs/promises')

test('readFile - success', async () => {
  const mockContent = Buffer.from('test content')
  jest.spyOn(FsPromises, 'readFile').mockResolvedValue(mockContent)

  const result = await FileSystem.readFile('/test/file.txt')
  expect(result).toEqual(mockContent)
  expect(FsPromises.readFile).toHaveBeenCalledWith('/test/file.txt')
})

test('readFile - error', async () => {
  const error = new Error('File read error')
  jest.spyOn(FsPromises, 'readFile').mockRejectedValue(error)

  await expect(FileSystem.readFile('/test/file.txt')).rejects.toThrow('File read error')
})

test('readFile - ENOENT error', async () => {
  const error = new Error('ENOENT: no such file')
  // @ts-ignore
  error.code = 'ENOENT'
  jest.spyOn(FsPromises, 'readFile').mockRejectedValue(error)

  await expect(FileSystem.readFile('/test/file.txt')).rejects.toThrow(error)
})
