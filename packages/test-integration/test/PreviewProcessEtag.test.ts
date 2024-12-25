import { expect, test } from '@jest/globals'
import getPort from 'get-port'
import { createPreviewProcess } from '../src/parts/CreatePreviewProcess/CreatePreviewProcess.js'
import { get } from '../src/parts/Get/Get.js'
import { getRoot } from '../src/parts/GetRoot/GetRoot.js'

test.skip('preview process - handles etag', async () => {
  const previewProcess = createPreviewProcess()
  const id = 1
  const port = await getPort()
  const root = getRoot()

  await previewProcess.invoke('WebViewServer.create', id)
  await previewProcess.invoke('WebViewServer.setHandler', id, '', root, '', '')
  await previewProcess.invoke('WebViewServer.start', id, port)

  // First request to get the etag
  const firstResponse = await get(`http://localhost:${port}/package.json`)
  expect(firstResponse.status).toBe(200)
  const etag = firstResponse.headers.get('ETag')
  expect(etag).toBeDefined()

  // Second request with matching etag
  const secondResponse = await get(`http://localhost:${port}/package.json`, {
    headers: {
      'If-None-Match': etag,
    },
  })
  expect(secondResponse.status).toBe(304) // Not Modified
  expect(secondResponse.headers.get('ETag')).toBe(etag)

  // Third request with non-matching etag
  const thirdResponse = await get(`http://localhost:${port}/package.json`, {
    headers: {
      'If-None-Match': '"invalid-etag"',
    },
  })
  expect(thirdResponse.status).toBe(200)
  expect(thirdResponse.headers.get('ETag')).toBe(etag)

  previewProcess[Symbol.dispose]()
})
