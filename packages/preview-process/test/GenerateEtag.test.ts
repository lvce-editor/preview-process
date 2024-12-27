import { expect, test } from '@jest/globals'
import * as GenerateEtag from '../src/parts/GenerateEtag/GenerateEtag.ts'

test('generateEtag - generates weak etag from content', () => {
  const content = 'test content'
  const etag = GenerateEtag.generateEtag(content)
  expect(etag).toMatch(/^W\/"[a-f0-9]+"$/)
})

test('generateEtag - generates different etags for different content', () => {
  const content1 = 'content 1'
  const content2 = 'content 2'
  const etag1 = GenerateEtag.generateEtag(content1)
  const etag2 = GenerateEtag.generateEtag(content2)
  expect(etag1).not.toBe(etag2)
})

test('generateEtag - generates same etag for same content', () => {
  const content = 'same content'
  const etag1 = GenerateEtag.generateEtag(content)
  const etag2 = GenerateEtag.generateEtag(content)
  expect(etag1).toBe(etag2)
})
