export const mockFs = async () => {
  const m = await import('node:module')

  const require = m.default.createRequire(import.meta.url)

  const fs = require('node:fs/promises')

  const mock = () => {
    throw new Error('oops')
  }
  fs.writeFile = mock

  const rr1 = fs.writeFile === mock

  m.syncBuiltinESMExports()
  // later

  const rr = await (async () => {
    const fs = await import('node:fs/promises')
    await fs.writeFile('/tmp/abc.txt', 'abc')
    console.log(fs.writeFile)
    return fs.writeFile === mock
  })()

  return `${rr} ${rr1}`
}
