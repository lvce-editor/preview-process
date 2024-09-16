import * as GetContentSecurityPolicy from '../GetContentSecurityPolicy/GetContentSecurityPolicy.ts'

export const getContentSecurityPolicyDocument = (frameAncestors: string, contentSecurityPolicy: string): string => {
  if (contentSecurityPolicy) {
    return contentSecurityPolicy
  }
  const csp = GetContentSecurityPolicy.getContentSecurityPolicy([
    "default-src 'none'",
    "script-src 'self'",
    "style-src 'self'",
    "img-src 'self' https:",
    "media-src 'self'",
    `frame-ancestors ${frameAncestors}`,
  ])
  return csp
}
