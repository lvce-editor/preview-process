import { expect, test } from '@jest/globals'
import * as GetPathName from '../src/parts/GetPathName/GetPathName.ts'

test('getPathName - normal url', () => {
  const request = {
    url: '/test/path',
    headers: {
      host: 'localhost:3000',
    },
  }
  expect(GetPathName.getPathName(request)).toBe('/test/path')
})

test('getPathName - with query parameters', () => {
  const request = {
    url: '/test/path?query=value',
    headers: {
      host: 'localhost:3000',
    },
  }
  expect(GetPathName.getPathName(request)).toBe('/test/path')
})

test('getPathName - with hash', () => {
  const request = {
    url: '/test/path#section',
    headers: {
      host: 'localhost:3000',
    },
  }
  expect(GetPathName.getPathName(request)).toBe('/test/path')
})

test('getPathName - empty url', () => {
  const request = {
    url: '',
    headers: {
      host: 'localhost:3000',
    },
  }
  expect(GetPathName.getPathName(request)).toBe('/')
})

test('getPathName - undefined url', () => {
  const request = {
    url: undefined,
    headers: {
      host: 'localhost:3000',
    },
  }
  expect(GetPathName.getPathName(request)).toBe('/')
})
