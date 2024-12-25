import * as m from 'node:module'

globalThis.mockModule = (moduleName, options) => {
  const require = m.default.createRequire(import.meta.url)
  const mockedModule = require(moduleName)
  const originalFn = mockedModule[options.functionName].bind(mockedModule)
  const mock = (...args) => {
    if (options.filePath && args[0] === options.filePath) {
      if (options.errorMessage && options.errorCode) {
        const error = new Error(options.errorMessage)
        // @ts-ignore
        error.code = options.errorCode
        throw error
      }
      if (options.returnValue !== undefined) {
        return options.returnValue
      }
    }
    return originalFn(...args)
  }
  mockedModule[options.functionName] = mock
  m.syncBuiltinESMExports()
}
