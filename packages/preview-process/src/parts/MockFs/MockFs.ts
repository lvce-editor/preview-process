export const mockFs = async (
  moduleName: string,
  key: string,
  arg0: string,
  errorMessage: string,
  errorCode: string,
): Promise<void> => {
  const m = await import('node:module')
  const require = m.default.createRequire(import.meta.url)
  const mockedModule = require(moduleName)
  const originalFn = mockedModule[key].bind(mockedModule)
  const mock = (...args: any[]): Promise<any> => {
    if (args[0] === arg0) {
      const error = new Error(errorMessage)
      // @ts-ignore
      error.code = errorCode
      throw error
    }
    return originalFn(...args)
  }
  mockedModule[key] = mock
  m.syncBuiltinESMExports()
}
