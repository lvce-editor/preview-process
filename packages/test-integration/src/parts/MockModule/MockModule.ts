import type CDP from 'chrome-remote-interface'

export const mockModule = async (
  client: CDP.Client,
  moduleName: string,
  key: string,
  arg0: string,
  errorMessage: string,
  errorCode: string,
): Promise<void> => {
  const global = await client.Runtime.evaluate({
    expression: 'globalThis',
  })
  await client.Runtime.callFunctionOn({
    objectId: global.result.objectId,
    functionDeclaration: `function(moduleName, key, arg0, errorMessage, errorCode){
      const global = this
      global.mockModule(moduleName, key, arg0, errorMessage, errorCode)
    }`,
    arguments: [{ value: moduleName }, { value: key }, { value: arg0 }, { value: errorMessage }, { value: errorCode }],
  })
}
