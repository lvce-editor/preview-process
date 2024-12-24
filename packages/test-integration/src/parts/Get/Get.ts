import ky from 'ky'

export const get = async (url: string) => {
  const response = await ky.get(url, {
    throwHttpErrors: false,
  })
  return response
}
