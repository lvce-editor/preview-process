import * as m from 'node:module'

globalThis.mockModule = (moduleName, key, arg0, errorMessage, errorCode) => {
  const require = m.default.createRequire(import.meta.url)
  const mockedModule = require(moduleName)
  const originalFn = mockedModule[key].bind(mockedModule)
  const mock = (...args) => {
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
