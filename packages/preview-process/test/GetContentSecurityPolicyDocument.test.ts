import { expect, test } from '@jest/globals'
import * as GetContentSecurityPolicyDocument from '../src/parts/GetContentSecurityPolicyDocument/GetContentSecurityPolicyDocument.js'

test('getContentSecurityPolicyDocument - with frame ancestors', () => {
  const contentSecurityPolicy =
    "default-src 'none'; img-src 'self' https: data:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
  expect(GetContentSecurityPolicyDocument.getContentSecurityPolicyDocument(contentSecurityPolicy)).toBe(contentSecurityPolicy)
})
