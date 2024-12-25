import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { BadRequestResponse } from '../Responses/BadRequestResponse.ts'
import { RangeNotSatisfiableResponse } from '../Responses/RangeNotSatisfiableResponse.ts'
import { RangeResponse } from '../Responses/RangeResponse.ts'

export const handleRangeRequest = async (filePath: string, range: string): Promise<Response> => {
  const stats = await stat(filePath)
  const [x, y] = range.replace('bytes=', '').split('-')
  const end = parseInt(y, 10)
  const start = parseInt(x, 10)

  if (isNaN(start) || isNaN(end)) {
    return new BadRequestResponse('Invalid Range')
  }

  const options = {
    start,
    end: end || stats.size - 1,
  }

  if (end >= stats.size) {
    options.end = stats.size - 1
  }

  if (start >= stats.size) {
    return new RangeNotSatisfiableResponse(stats.size)
  }

  const readStream = createReadStream(filePath, options)
  return new RangeResponse(readStream, start, options.end, stats.size)
}
