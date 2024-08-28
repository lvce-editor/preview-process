const servers = Object.create(null)

export const set = (id: number, server) => {
  servers[id] = server
}
