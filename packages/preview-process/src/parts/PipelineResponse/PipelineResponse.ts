import { pipeline } from 'node:stream/promises'

export const pipelineResponse = async (response: any, stream: any): Promise<void> => {
  await pipeline(stream, response)
}
