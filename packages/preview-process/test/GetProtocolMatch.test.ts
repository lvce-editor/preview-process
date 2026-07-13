import { expect, test } from '@jest/globals'
import * as GetProtocolMatch from '../src/parts/GetProtocolMatch/GetProtocolMatch.ts'

test('getProtocolMatch - valid url', () => {
  expect(GetProtocolMatch.getProtocolMatch('lvce-webview://test-domain')).toEqual({
    domain: 'test-domain',
    protocol: 'lvce-webview',
  })
})

test('getProtocolMatch - valid url with dashes', () => {
  expect(GetProtocolMatch.getProtocolMatch('lvce-oss-webview://test-domain')).toEqual({
    domain: 'test-domain',
    protocol: 'lvce-oss-webview',
  })
})

test('getProtocolMatch - valid url with dots', () => {
  expect(GetProtocolMatch.getProtocolMatch('lvce-webview://test.domain.com')).toEqual({
    domain: 'test.domain.com',
    protocol: 'lvce-webview',
  })
})

test('getProtocolMatch - invalid url format', () => {
  expect(() => GetProtocolMatch.getProtocolMatch('invalid-url')).toThrow('Failed to parse url')
})

test('getProtocolMatch - empty string', () => {
  expect(() => GetProtocolMatch.getProtocolMatch('')).toThrow('Failed to parse url')
})
