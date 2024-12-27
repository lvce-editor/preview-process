import { expect, test } from '@jest/globals'
import * as ToTitleCase from '../src/parts/ToTitleCase/ToTitleCase.ts'

test('toTitleCase - single word', () => {
  expect(ToTitleCase.toTitleCase('content')).toBe('Content')
})

test('toTitleCase - multiple words', () => {
  expect(ToTitleCase.toTitleCase('content-type')).toBe('Content-Type')
})

test('toTitleCase - already title case', () => {
  expect(ToTitleCase.toTitleCase('Content-Type')).toBe('Content-Type')
})

test('toTitleCase - all uppercase', () => {
  expect(ToTitleCase.toTitleCase('CONTENT-TYPE')).toBe('Content-Type')
})

test('toTitleCase - mixed case', () => {
  expect(ToTitleCase.toTitleCase('ConTENT-tYPe')).toBe('Content-Type')
})

test('toTitleCase - multiple hyphens', () => {
  expect(ToTitleCase.toTitleCase('cross-origin-resource-policy')).toBe('Cross-Origin-Resource-Policy')
})

test('toTitleCase - etag special case', () => {
  expect(ToTitleCase.toTitleCase('etag')).toBe('ETag')
})

test('toTitleCase - etag special case with different casing', () => {
  expect(ToTitleCase.toTitleCase('ETAG')).toBe('ETag')
  expect(ToTitleCase.toTitleCase('ETag')).toBe('ETag')
  expect(ToTitleCase.toTitleCase('etAG')).toBe('ETag')
})
