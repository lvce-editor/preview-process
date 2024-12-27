import { expect, test } from '@jest/globals'
import * as GetEtag from '../src/parts/GetEtag/GetEtag.ts'

test('getEtag - generates correct etag from file stats', () => {
  const mockStats = {
    ino: 12345,
    size: 1000,
    mtime: new Date('2024-01-01T00:00:00Z'),
  }
  const expectedEtag = `W/"12345-1000-1704067200000"`
  expect(GetEtag.getEtag(mockStats)).toBe(expectedEtag)
})

test('getEtag - handles different file stats', () => {
  const mockStats = {
    ino: 67890,
    size: 500,
    mtime: new Date('2024-02-01T12:30:45Z'),
  }
  const expectedEtag = `W/"67890-500-1706789445000"`
  expect(GetEtag.getEtag(mockStats)).toBe(expectedEtag)
})

test('getEtag - generates different etags for different files', () => {
  const stats1 = {
    ino: 111,
    size: 100,
    mtime: new Date('2024-01-01T00:00:00Z'),
  }
  const stats2 = {
    ino: 222,
    size: 200,
    mtime: new Date('2024-01-02T00:00:00Z'),
  }
  const etag1 = GetEtag.getEtag(stats1)
  const etag2 = GetEtag.getEtag(stats2)
  expect(etag1).not.toBe(etag2)
})

test('getEtag - includes W/ prefix for weak validation', () => {
  const mockStats = {
    ino: 12345,
    size: 1000,
    mtime: new Date('2024-01-01T00:00:00Z'),
  }
  expect(GetEtag.getEtag(mockStats)).toMatch(/^W\/".*"$/)
})
