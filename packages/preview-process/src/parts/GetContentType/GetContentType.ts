import { extname } from 'node:path'

const textMimeType: Record<string, string> = {
  '.avif': 'image/avif',
  '.css': 'text/css',
  '.html': 'text/html',
  '.ico': 'image/x-icon',
  '.jpe': 'image/jpg',
  '.jpeg': 'image/jpg',
  '.jpg': 'image/jpg',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.mjs': 'text/javascript',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ts': 'text/javascript',
  '.ttf': 'font/ttf',
  '.webp': 'image/webp',
  '.woff': 'application/font-woff',
}

export const getContentType = (filePath: string): string => {
  return textMimeType[extname(filePath)] || 'text/plain'
}
