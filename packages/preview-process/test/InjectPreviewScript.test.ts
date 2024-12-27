import { expect, test } from '@jest/globals'
import * as InjectPreviewScript from '../src/parts/InjectPreviewScript/InjectPreviewScript.ts'

test('injectPreviewScript - injects script after title', () => {
  const html = '<html><head><title>Test Page</title></head><body></body></html>'
  const expected =
    '<html><head><title>Test Page</title>\n<script type="module" src="/preview-injected.js"></script>\n</head><body></body></html>'
  expect(InjectPreviewScript.injectPreviewScript(html)).toBe(expected)
})

test('injectPreviewScript - handles html with no content after title', () => {
  const html = '<html><head><title>Test</title>'
  const expected = '<html><head><title>Test</title>\n<script type="module" src="/preview-injected.js"></script>\n'
  expect(InjectPreviewScript.injectPreviewScript(html)).toBe(expected)
})

test('injectPreviewScript - preserves existing head content', () => {
  const html = '<html><head><title>Test</title><link rel="stylesheet" href="styles.css"></head>'
  const expected =
    '<html><head><title>Test</title>\n<script type="module" src="/preview-injected.js"></script>\n<link rel="stylesheet" href="styles.css"></head>'
  expect(InjectPreviewScript.injectPreviewScript(html)).toBe(expected)
})

test('injectPreviewScript - handles title with attributes', () => {
  const html = '<html><head><title id="page-title">Test</title></head>'
  const expected =
    '<html><head><title id="page-title">Test</title>\n<script type="module" src="/preview-injected.js"></script>\n</head>'
  expect(InjectPreviewScript.injectPreviewScript(html)).toBe(expected)
})

test('injectPreviewScript - preserves whitespace and formatting', () => {
  const html = '<html>\n  <head>\n    <title>Test</title>\n  </head>\n</html>'
  const expected =
    '<html>\n  <head>\n    <title>Test</title>\n<script type="module" src="/preview-injected.js"></script>\n\n  </head>\n</html>'
  expect(InjectPreviewScript.injectPreviewScript(html)).toBe(expected)
})
