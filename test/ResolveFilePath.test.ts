import { expect, test } from '@jest/globals'
import * as ResolveFilePath from '../src/parts/ResolveFilePath/ResolveFilePath.js'
import { join } from 'node:path'

test('resolveFilePath - normal path', () => {
  const pathName = '/test/file.txt'
  const webViewRoot = '/root'
  expect(ResolveFilePath.resolveFilePath(pathName, webViewRoot)).toBe(join('/root', 'test/file.txt'))
})

test('resolveFilePath - path with dots', () => {
  const pathName = '/test/../file.txt'
  const webViewRoot = '/root'
  expect(ResolveFilePath.resolveFilePath(pathName, webViewRoot)).toBe(join('/root', 'file.txt'))
})

test('resolveFilePath - empty path', () => {
  const pathName = ''
  const webViewRoot = '/root'
  expect(ResolveFilePath.resolveFilePath(pathName, webViewRoot)).toBe('/root')
})

test('resolveFilePath - root path', () => {
  const pathName = '/'
  const webViewRoot = '/root'
  expect(ResolveFilePath.resolveFilePath(pathName, webViewRoot)).toBe('/root/')
})

test('resolveFilePath - path with query parameters', () => {
  const pathName = '/test/file.txt?query=value'
  const webViewRoot = '/root'
  expect(ResolveFilePath.resolveFilePath(pathName, webViewRoot)).toBe(join('/root', 'test/file.txt'))
})

test('resolveFilePath - path with hash', () => {
  const pathName = '/test/file.txt#section'
  const webViewRoot = '/root'
  expect(ResolveFilePath.resolveFilePath(pathName, webViewRoot)).toBe(join('/root', 'test/file.txt'))
})
