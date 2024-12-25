import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import * as HttpHeader from '../HttpHeader/HttpHeader.ts'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.ts'

// TODO add lots of tests for this
export const handleRangeRequest = async (filePath: string, range: string): Promise<Response> => {
  const stats = await stat(filePath)
  const code = HttpStatusCode.PartialContent
  const [x, y] = range.replace('bytes=', '').split('-')
  const end = parseInt(y, 10)
  const start = parseInt(x, 10)

  if (isNaN(start) || isNaN(end)) {
    return new Response('Invalid Range', {
      status: HttpStatusCode.BadRequest,
      headers: {
        [HttpHeader.ContentRange]: `bytes */${stats.size}`,
      },
    })
  }

  const options = {
    start,
    end: end || stats.size - 1,
  }

  if (end >= stats.size) {
    options.end = stats.size - 1
  }

  if (start >= stats.size) {
    return new Response(null, {
      status: HttpStatusCode.RangeNotSatisfiable,
      headers: {
        [HttpHeader.ContentRange]: `bytes */${stats.size}`,
      },
    })
  }

  const readStream = createReadStream(filePath, options)
  return new Response(readStream, {
    status: code,
    headers: {
      [HttpHeader.ContentRange]: `bytes ${start}-${options.end}/${stats.size}`,
      [HttpHeader.ContentLength]: `${options.end - start + 1}`,
      [HttpHeader.AcceptRanges]: 'bytes',
    },
  })
}
