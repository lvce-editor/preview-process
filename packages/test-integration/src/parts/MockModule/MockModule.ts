import type CDP from 'chrome-remote-interface'

export const mockModule = async (
  runtime: CDP.Client['Runtime'],
  moduleName: string,
  key: string,
  arg0: string,
  errorMessage: string,
  errorCode: string,
): Promise<void> => {
  const global = await runtime.evaluate({
    expression: 'globalThis',
  })
  await runtime.callFunctionOn({
    objectId: global.result.objectId,
    functionDeclaration: `function(moduleName, key, arg0, errorMessage, errorCode){
      const global = this
      global.mockModule(moduleName, key, arg0, errorMessage, errorCode)
    }`,
    arguments: [{ value: moduleName }, { value: key }, { value: arg0 }, { value: errorMessage }, { value: errorCode }],
  })
}
