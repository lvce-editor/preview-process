import ky from 'ky'

export const get = async (url: string): Promise<any> => {
  const response = await ky.get(url, {
    throwHttpErrors: false,
  })
  return response
}
