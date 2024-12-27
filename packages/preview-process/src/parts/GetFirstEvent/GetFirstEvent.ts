import type { EventEmitter } from 'node:events'
import type { FirstEvent } from '../FirstEvent/FirstEvent.ts'

const addListener = (emitter: EventEmitter, type: string, callback: any): void => {
  emitter.on(type, callback)
}

const removeListener = (emitter: EventEmitter, type: string, callback: any): void => {
  emitter.off(type, callback)
}

export const getFirstEvent = (eventEmitter: EventEmitter, eventMap: any): Promise<FirstEvent> => {
  const { resolve, promise } = Promise.withResolvers<FirstEvent>()
  const listenerMap = Object.create(null)
  const cleanup = (value: any): void => {
    for (const event of Object.keys(eventMap)) {
      removeListener(eventEmitter, event, listenerMap[event])
    }
    resolve(value)
  }
  for (const [event, type] of Object.entries(eventMap)) {
    const listener = (event: any): void => {
      cleanup({
        type,
        event,
      })
    }
    addListener(eventEmitter, event, listener)
    listenerMap[event] = listener
  }
  return promise
}
