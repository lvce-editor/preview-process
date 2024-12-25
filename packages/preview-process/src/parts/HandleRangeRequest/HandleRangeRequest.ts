import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { BadRequestResponse } from '../Responses/BadRequestResponse.ts'
import { RangeNotSatisfiableResponse } from '../Responses/RangeNotSatisfiableResponse.ts'
import { RangeResponse } from '../Responses/RangeResponse.ts'

export const handleRangeRequest = async (filePath: string, range: string): Promise<Response> => {
  const stats = await stat(filePath)
  const [x, y] = range.replace('bytes=', '').split('-')
  const start = parseInt(x, 10)

  if (isNaN(start)) {
    return new BadRequestResponse('Invalid Range')
  }

  if (start >= stats.size) {
    return new RangeNotSatisfiableResponse(stats.size)
  }

  const end = y ? parseInt(y, 10) : stats.size - 1
  const finalEnd = end >= stats.size ? stats.size - 1 : end

  const readStream = createReadStream(filePath, {
    start,
    end: finalEnd,
  })
  return new RangeResponse(readStream, start, finalEnd, stats.size)
}
