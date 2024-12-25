import { expect, test } from '@jest/globals'
import * as HttpStatusCode from '../src/parts/HttpStatusCode/HttpStatusCode.ts'
import { BadRequestResponse } from '../src/parts/Responses/BadRequestResponse.ts'

test('BadRequestResponse - creates response with default message', async () => {
  const response = new BadRequestResponse()
  expect(response.status).toBe(HttpStatusCode.BadRequest)
  expect(await response.text()).toBe('Bad Request')
  expect(response.headers.get('Cross-Origin-Resource-Policy')).toBe('same-origin')
})

test('BadRequestResponse - creates response with custom message', async () => {
  const response = new BadRequestResponse('Invalid Range')
  expect(response.status).toBe(HttpStatusCode.BadRequest)
  expect(await response.text()).toBe('Invalid Range')
  expect(response.headers.get('Cross-Origin-Resource-Policy')).toBe('same-origin')
})
