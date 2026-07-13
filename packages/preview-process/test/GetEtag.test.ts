import { expect, test } from '@jest/globals'
import * as GetEtag from '../src/parts/GetEtag/GetEtag.ts'

test('getEtag - generates correct etag from file stats', () => {
  const mockStats = {
    ino: 12_345,
    mtime: new Date('2024-01-01T00:00:00Z'),
    size: 1000,
  }
  const expectedEtag = `W/"12345-1000-1704067200000"`
  expect(GetEtag.getEtag(mockStats)).toBe(expectedEtag)
})

test('getEtag - handles different file stats', () => {
  const mockStats = {
    ino: 67_890,
    mtime: new Date('2024-02-01T12:30:45Z'),
    size: 500,
  }
  const expectedEtag = `W/"67890-500-1706790645000"`
  expect(GetEtag.getEtag(mockStats)).toBe(expectedEtag)
})

test('getEtag - generates different etags for different files', () => {
  const stats1 = {
    ino: 111,
    mtime: new Date('2024-01-01T00:00:00Z'),
    size: 100,
  }
  const stats2 = {
    ino: 222,
    mtime: new Date('2024-01-02T00:00:00Z'),
    size: 200,
  }
  const etag1 = GetEtag.getEtag(stats1)
  const etag2 = GetEtag.getEtag(stats2)
  expect(etag1).not.toBe(etag2)
})

test('getEtag - includes W/ prefix for weak validation', () => {
  const mockStats = {
    ino: 12_345,
    mtime: new Date('2024-01-01T00:00:00Z'),
    size: 1000,
  }
  expect(GetEtag.getEtag(mockStats)).toMatch(/^W\/".*"$/)
})
