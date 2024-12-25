import type CDP from 'chrome-remote-interface'

interface MockOptions {
  readonly moduleName: string
  readonly functionName: string
  readonly filePath?: string
  readonly returnValue?: any
  readonly errorMessage?: string
  readonly errorCode?: string
}

export const mockModule = async (runtime: CDP.Client['Runtime'], options: MockOptions): Promise<void> => {
  const { moduleName, functionName, filePath, returnValue, errorMessage, errorCode } = options

  let mockCode = `
    const originalModule = await import('${moduleName}')
    const mockedModule = { ...originalModule }
    mockedModule['${functionName}'] = async (...args) => {
  `

  if (filePath) {
    mockCode += `
      const firstArg = args[0]
      if (firstArg === '${filePath}') {
    `
  }

  if (errorMessage && errorCode) {
    mockCode += `
        const error = new Error('${errorMessage}')
        error.code = '${errorCode}'
        throw error
    `
  } else if (returnValue) {
    mockCode += `
        return ${JSON.stringify(returnValue)}
    `
  }

  if (filePath) {
    mockCode += `
      }
      return originalModule['${functionName}'](...args)
    `
  }

  mockCode += `
    }
    globalThis['${moduleName}'] = mockedModule
  `

  await runtime.evaluate({
    expression: mockCode,
    awaitPromise: true,
  })
}
