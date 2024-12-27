import { expect, test } from '@jest/globals'
import { EventEmitter } from 'node:events'
import * as WaitForServerToBeReady from '../src/parts/WaitForServerToBeReady/WaitForServerToBeReady.ts'
import type { WebViewServer } from '../src/parts/WebViewServerTypes/WebViewServerTypes.ts'

class MockServer extends EventEmitter implements WebViewServer {
  handler = undefined
  listening = false

  setHandler(handler: any): void {
    this.handler = handler
  }

  listen(port: string, callback: () => void): void {
    process.nextTick(() => {
      this.listening = true
      this.emit('listening')
      callback()
    })
  }
  isListening() {
    return this.listening
  }
}

test('waitForServerToBeReady - success', async () => {
  const server = new MockServer()
  const port = '3000'
  await WaitForServerToBeReady.waitForServerToBeReady(server, port)
  expect(server.listening).toBe(true)
})

test('waitForServerToBeReady - handles EADDRINUSE error', async () => {
  const server = new MockServer()
  const port = '3000'
  process.nextTick(() => {
    server.emit('error', new Error('EADDRINUSE'))
  })
  await expect(WaitForServerToBeReady.waitForServerToBeReady(server, port)).rejects.toThrow('EADDRINUSE')
})

test('waitForServerToBeReady - handles other errors', async () => {
  const server = new MockServer()
  const port = '3000'
  process.nextTick(() => {
    server.emit('error', new Error('Some other error'))
  })
  await expect(WaitForServerToBeReady.waitForServerToBeReady(server, port)).rejects.toThrow('Some other error')
})
