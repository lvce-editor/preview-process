import { expect, test } from '@jest/globals'
import { join } from 'node:path'
import * as ResolveFilePath from '../src/parts/ResolveFilePath/ResolveFilePath.ts'

test('resolveFilePath - normal path', () => {
  const pathName = '/test/file.txt'
  const webViewRoot = process.platform === 'win32' ? 'C:/root' : '/root'
  expect(ResolveFilePath.resolveFilePath(pathName, webViewRoot)).toBe(join(webViewRoot, 'test/file.txt'))
})

test('resolveFilePath - path with dots', () => {
  const pathName = '/test/../file.txt'
  const webViewRoot = process.platform === 'win32' ? 'C:/root' : '/root'
  expect(ResolveFilePath.resolveFilePath(pathName, webViewRoot)).toBe(join(webViewRoot, 'file.txt'))
})

test('resolveFilePath - empty path', () => {
  const pathName = ''
  const webViewRoot = process.platform === 'win32' ? 'C:/root' : '/root'
  expect(ResolveFilePath.resolveFilePath(pathName, webViewRoot)).toBe(webViewRoot)
})

test('resolveFilePath - root path', () => {
  const pathName = '/'
  const webViewRoot = process.platform === 'win32' ? 'C:/root' : '/root'
  expect(ResolveFilePath.resolveFilePath(pathName, webViewRoot)).toBe(webViewRoot + '/')
})

test('resolveFilePath - path with query parameters', () => {
  const pathName = '/test/file.txt?query=value'
  const webViewRoot = process.platform === 'win32' ? 'C:/root' : '/root'
  expect(ResolveFilePath.resolveFilePath(pathName, webViewRoot)).toBe(join(webViewRoot, 'test/file.txt'))
})

test('resolveFilePath - path with hash', () => {
  const pathName = '/test/file.txt#section'
  const webViewRoot = process.platform === 'win32' ? 'C:/root' : '/root'
  expect(ResolveFilePath.resolveFilePath(pathName, webViewRoot)).toBe(join(webViewRoot, 'test/file.txt'))
})
