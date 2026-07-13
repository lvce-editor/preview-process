import { expect, test } from '@jest/globals'
import * as GetPathName from '../src/parts/GetPathName/GetPathName.ts'

test('getPathName - normal url', () => {
  const request = {
    headers: {
      host: 'localhost:3000',
    },
    url: '/test/path',
  }
  expect(GetPathName.getPathName(request)).toBe('/test/path')
})

test('getPathName - with query parameters', () => {
  const request = {
    headers: {
      host: 'localhost:3000',
    },
    url: '/test/path?query=value',
  }
  expect(GetPathName.getPathName(request)).toBe('/test/path')
})

test('getPathName - with hash', () => {
  const request = {
    headers: {
      host: 'localhost:3000',
    },
    url: '/test/path#section',
  }
  expect(GetPathName.getPathName(request)).toBe('/test/path')
})

test('getPathName - empty url', () => {
  const request = {
    headers: {
      host: 'localhost:3000',
    },
    url: '',
  }
  expect(GetPathName.getPathName(request)).toBe('/')
})

test('getPathName - undefined url', () => {
  const request = {
    headers: {
      host: 'localhost:3000',
    },
    url: undefined,
  }
  expect(GetPathName.getPathName(request)).toBe('/')
})
