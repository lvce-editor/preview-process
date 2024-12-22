import { expect, test } from '@jest/globals'
import * as GetElectronFileResponseAbsolutePath from '../src/parts/GetElectronFileResponseAbsolutePath/GetElectronFileResponseAbsolutePath.js'

test('getElectronFileResponseAbsolutePath - normal url', () => {
  const url = 'lvce-webview://-/test/file.txt'
  expect(GetElectronFileResponseAbsolutePath.getElectronFileResponseAbsolutePath(url)).toBe('/test/file.txt')
})

test('getElectronFileResponseAbsolutePath - url ending with slash', () => {
  const url = 'lvce-webview://-/test/folder/'
  expect(GetElectronFileResponseAbsolutePath.getElectronFileResponseAbsolutePath(url)).toBe('/test/folder/index.html')
})

test('getElectronFileResponseAbsolutePath - remote url with double slash', () => {
  const url = 'lvce-webview://-/remote//home/user/file.txt'
  expect(GetElectronFileResponseAbsolutePath.getElectronFileResponseAbsolutePath(url)).toBe('/home/user/file.txt')
})

test('getElectronFileResponseAbsolutePath - remote url with single slash', () => {
  const url = 'lvce-webview://-/remote/home/user/file.txt'
  expect(GetElectronFileResponseAbsolutePath.getElectronFileResponseAbsolutePath(url)).toBe('/home/user/file.txt')
})

test('getElectronFileResponseAbsolutePath - invalid url', () => {
  const url = ':::invalid:::'
  expect(GetElectronFileResponseAbsolutePath.getElectronFileResponseAbsolutePath(url)).toBe('')
})
