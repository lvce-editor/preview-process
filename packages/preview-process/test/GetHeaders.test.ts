import { expect, test } from '@jest/globals'
import * as GetHeaders from '../src/parts/GetHeaders/GetHeaders.ts'
import * as HttpHeader from '../src/parts/HttpHeader/HttpHeader.ts'

test('getHeaders - html file with etag', () => {
  const absolutePath = '/test/index.html'
  const etag = '"123"'
  expect(GetHeaders.getHeaders(absolutePath, etag)).toEqual({
    [HttpHeader.ContentType]: 'text/html',
    [HttpHeader.Etag]: '"123"',
    [HttpHeader.CrossOriginResourcePolicy]: 'same-origin',
    [HttpHeader.CrossOriginEmbedderPolicy]: 'require-corp',
  })
})

test('getHeaders - css file with etag', () => {
  const absolutePath = '/test/styles.css'
  const etag = '"456"'
  expect(GetHeaders.getHeaders(absolutePath, etag)).toEqual({
    [HttpHeader.ContentType]: 'text/css',
    [HttpHeader.Etag]: '"456"',
    [HttpHeader.CrossOriginResourcePolicy]: 'same-origin',
  })
})

test('getHeaders - javascript file with etag', () => {
  const absolutePath = '/test/script.js'
  const etag = '"789"'
  expect(GetHeaders.getHeaders(absolutePath, etag)).toEqual({
    [HttpHeader.ContentType]: 'text/javascript',
    [HttpHeader.Etag]: '"789"',
    [HttpHeader.CrossOriginResourcePolicy]: 'same-origin',
  })
})

test('getHeaders - unknown file type with etag', () => {
  const absolutePath = '/test/file.xyz'
  const etag = '"abc"'
  expect(GetHeaders.getHeaders(absolutePath, etag)).toEqual({
    [HttpHeader.ContentType]: '',
    [HttpHeader.Etag]: '"abc"',
    [HttpHeader.CrossOriginResourcePolicy]: 'same-origin',
  })
})

test('getHeaders - html file without etag', () => {
  const absolutePath = '/test/index.html'
  expect(GetHeaders.getHeaders(absolutePath)).toEqual({
    [HttpHeader.ContentType]: 'text/html',
    [HttpHeader.CrossOriginResourcePolicy]: 'same-origin',
    [HttpHeader.CrossOriginEmbedderPolicy]: 'require-corp',
  })
})
