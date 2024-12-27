import type CDP from 'chrome-remote-interface'
import { VError } from '@lvce-editor/verror'

interface MockOptions {
  readonly moduleName: string
  readonly functionName: string
  readonly filePath?: string
  readonly returnValue?: any
  readonly errorMessage?: string
  readonly errorCode?: string
}

export const mockModule = async (runtime: CDP.Client['Runtime'], options: MockOptions): Promise<void> => {
  try {
    await runtime.evaluate({
      expression: `mockModule('${options.moduleName}', ${JSON.stringify(options)})`,
    })
  } catch (error) {
    throw new VError(error, `Failed to mock module`)
  }
}
