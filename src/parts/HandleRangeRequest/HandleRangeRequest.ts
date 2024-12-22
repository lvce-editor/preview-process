import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import * as HttpHeader from '../HttpHeader/HttpHeader.ts'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.ts'

// TODO add lots of tests for this
export const handleRangeRequest = async (filePath: string, range: string): Promise<Response> => {
  const stats = await stat(filePath)
  const code = HttpStatusCode.PartialContent
  const [x, y] = range.replace('bytes=', '').split('-')
  let end = parseInt(y, 10) || stats.size - 1
  const start = parseInt(x, 10) || 0
  const options = {
    start,
    end,
  }
  if (end >= stats.size) {
    end = stats.size - 1
  }
  if (start >= stats.size) {
    return new Response(null, {
      status: HttpStatusCode.OtherError,
      headers: {
        [HttpHeader.ContentRange]: `bytes */${stats.size}`,
      },
    })
  }
  const readStream = createReadStream(filePath, options)
  return new Response(readStream, {
    status: code,
    headers: {
      [HttpHeader.ContentRange]: `bytes ${start}-${end}/${stats.size}`,
      [HttpHeader.ContentLength]: `${end - start + 1}`,
      [HttpHeader.AcceptRanges]: 'bytes',
    },
  })
}
