import { expect, test } from '@jest/globals'
import * as ResolveFilePath from '../src/parts/ResolveFilePath/ResolveFilePath.ts'

test('resolveFilePath - remote path', () => {
  const pathName = process.platform === 'win32' ? '/remote/C:/test/file.txt' : '/remote//test/file.txt'
  const webViewRoot = '/root'
  const expected = process.platform === 'win32' ? String.raw`C:\test\file.txt` : '/test/file.txt'
  expect(ResolveFilePath.resolveFilePath(pathName, webViewRoot)).toBe(expected)
})

test.skip('resolveFilePath - remote path with double slash', () => {
  const pathName = process.platform === 'win32' ? '/remote//C:/test/file.txt' : '/remote///test/file.txt'
  const webViewRoot = '/root'
  const expected = process.platform === 'win32' ? String.raw`C:\test\file.txt` : '/test/file.txt'
  expect(ResolveFilePath.resolveFilePath(pathName, webViewRoot)).toBe(expected)
})

test('resolveFilePath - normal path', () => {
  const pathName = '/test/file.txt'
  const webViewRoot = process.platform === 'win32' ? 'C:/root' : '/root'
  const expected = process.platform === 'win32' ? String.raw`C:\root\test\file.txt` : '/root/test/file.txt'
  expect(ResolveFilePath.resolveFilePath(pathName, webViewRoot)).toBe(expected)
})
