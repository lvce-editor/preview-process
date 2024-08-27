import * as CommandState from '../CommandState/CommandState.ts'

export const execute = (command: string, ...args: any[]) => {
  const fn = CommandState.getCommand(command)
  if (!fn) {
    throw new Error(`Command not found ${command}`)
  }

  return fn(...args)
}
