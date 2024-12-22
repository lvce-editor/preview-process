import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { OutgoingHttpHeaders, ServerResponse } from 'node:http'
import { pipeline } from 'node:stream/promises'
import * as HttpHeader from '../HttpHeader/HttpHeader.ts'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.ts'
import * as IsStreamPrematureCloseError from '../IsStreamPrematureCloseError/IsStreamPrematureCloseError.ts'

// TODO add lots of tests for this
export const handleRangeRequest = async (filePath: string, range: string, res: ServerResponse): Promise<void> => {
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
    res.setHeader(HttpHeader.ContentRange, `bytes */${stats.size}`)
    res.statusCode = HttpStatusCode.OtherError
    res.end()
    return
  }
  const headers: OutgoingHttpHeaders = {
    [HttpHeader.ContentRange]: `bytes ${start}-${end}/${stats.size}`,
    [HttpHeader.ContentLength]: end - start + 1,
    [HttpHeader.AcceptRanges]: 'bytes',
  }
  res.writeHead(code, headers)
  const readStream = createReadStream(filePath, options)
  try {
    await pipeline(readStream, res)
  } catch (error) {
    if (IsStreamPrematureCloseError.isStreamPrematureCloseError(error)) {
      return
    }
    console.error(`[preview-process] ${error}`)
  }
}
