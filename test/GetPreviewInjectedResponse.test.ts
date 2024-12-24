import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/PreviewInjectedCode/PreviewInjectedCode.ts', () => {
  return {
    injectedCode: 'console.log("mocked code")',
  }
})

const GetPreviewInjectedResponse = await import('../src/parts/GetPreviewInjectedResponse/GetPreviewInjectedResponse.ts')

test('getPreviewInjectedResponse', async () => {
  const response = await GetPreviewInjectedResponse.getPreviewInjectedResponse()

  expect(response).toEqual({
    body: 'console.log("mocked code")',
    init: {
      status: 200,
      headers: {
        'Content-Type': 'text/javascript',
        'Cross-Origin-Resource-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp',
      },
    },
  })
})
