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
  await runtime.evaluate({
    expression: `mockModule('${options.moduleName}', ${JSON.stringify(options)})`,
    awaitPromise: true,
  })
}
