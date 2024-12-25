import type { RouteHandler } from '../RouteHandler/RouteHandler.ts'

export const findMatchingRoute = (path: string, routes: readonly RouteHandler[]): RouteHandler => {
  return routes.find((route) => (typeof route.pattern === 'string' ? path === route.pattern : route.pattern.test(path)))
}
