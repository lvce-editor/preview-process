import { expect, test } from '@jest/globals'

const GetPreviewInjectedResponse = await import('../src/parts/GetPreviewInjectedResponse/GetPreviewInjectedResponse.ts')

test('getPreviewInjectedResponse', async () => {
  const injectedCode = 'console.log("mocked code")'
  const response = await GetPreviewInjectedResponse.getPreviewInjectedResponse(injectedCode)

  expect(response).toEqual({
    body: 'console.log("mocked code")',
    init: {
      status: 200,
      headers: {
        'Content-Type': 'text/javascript',
        'Cross-Origin-Resource-Policy': 'same-origin',
      },
    },
  })
})
