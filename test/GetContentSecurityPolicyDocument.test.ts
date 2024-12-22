import { expect, test } from '@jest/globals'
import * as GetContentSecurityPolicyDocument from '../src/parts/GetContentSecurityPolicyDocument/GetContentSecurityPolicyDocument.js'

test('getContentSecurityPolicyDocument - with frame ancestors', () => {
  const frameAncestors = 'vscode-webview://*'
  const contentSecurityPolicy =
    "default-src 'none'; img-src 'self' https: data:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
  expect(GetContentSecurityPolicyDocument.getContentSecurityPolicyDocument(frameAncestors, contentSecurityPolicy)).toBe(
    "default-src 'none'; img-src 'self' https: data:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; frame-ancestors vscode-webview://*;",
  )
})

test('getContentSecurityPolicyDocument - empty frame ancestors', () => {
  const frameAncestors = ''
  const contentSecurityPolicy = "default-src 'none'; img-src 'self' https: data:; script-src 'self' 'unsafe-inline';"
  expect(GetContentSecurityPolicyDocument.getContentSecurityPolicyDocument(frameAncestors, contentSecurityPolicy)).toBe(
    "default-src 'none'; img-src 'self' https: data:; script-src 'self' 'unsafe-inline';",
  )
})

test('getContentSecurityPolicyDocument - empty content security policy', () => {
  const frameAncestors = 'vscode-webview://*'
  const contentSecurityPolicy = ''
  expect(GetContentSecurityPolicyDocument.getContentSecurityPolicyDocument(frameAncestors, contentSecurityPolicy)).toBe(
    'frame-ancestors vscode-webview://*;',
  )
})

test('getContentSecurityPolicyDocument - both empty', () => {
  const frameAncestors = ''
  const contentSecurityPolicy = ''
  expect(GetContentSecurityPolicyDocument.getContentSecurityPolicyDocument(frameAncestors, contentSecurityPolicy)).toBe('')
})
