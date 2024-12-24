import { expect, test, jest } from '@jest/globals'
import * as GetMimeType from '../src/parts/GetMimeType/GetMimeType.ts'
import * as MimeType from '../src/parts/MimeType/MimeType.ts'

test('getMimeType - html', () => {
  expect(GetMimeType.getMimeType('.html')).toBe(MimeType.TextHtml)
})

test('getMimeType - css', () => {
  expect(GetMimeType.getMimeType('.css')).toBe(MimeType.TextCss)
})

test('getMimeType - ttf', () => {
  expect(GetMimeType.getMimeType('.ttf')).toBe(MimeType.FontTtf)
})

test('getMimeType - js', () => {
  expect(GetMimeType.getMimeType('.js')).toBe(MimeType.TextJavaScript)
})

test('getMimeType - mjs', () => {
  expect(GetMimeType.getMimeType('.mjs')).toBe(MimeType.TextJavaScript)
})

test('getMimeType - ts', () => {
  expect(GetMimeType.getMimeType('.ts')).toBe(MimeType.TextJavaScript)
})

test('getMimeType - svg', () => {
  expect(GetMimeType.getMimeType('.svg')).toBe(MimeType.ImageSvgXml)
})

test('getMimeType - png', () => {
  expect(GetMimeType.getMimeType('.png')).toBe(MimeType.ImagePng)
})

test('getMimeType - json', () => {
  expect(GetMimeType.getMimeType('.json')).toBe(MimeType.ApplicationJson)
})

test('getMimeType - map', () => {
  expect(GetMimeType.getMimeType('.map')).toBe(MimeType.ApplicationJson)
})

test('getMimeType - mp3', () => {
  expect(GetMimeType.getMimeType('.mp3')).toBe(MimeType.AudioMpeg)
})

test('getMimeType - unknown extension', () => {
  const spy = jest.spyOn(console, 'warn').mockImplementation(() => {})
  expect(GetMimeType.getMimeType('.unknown')).toBe('')
  expect(spy).toHaveBeenCalledWith('unsupported file extension: .unknown')
  spy.mockRestore()
})
