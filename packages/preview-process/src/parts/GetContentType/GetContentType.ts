import { extname } from 'node:path'

const textMimeType: Record<string, string> = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.ts': 'text/javascript',
  '.mjs': 'text/javascript',
  '.json': 'application/json',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
  '.woff': 'application/font-woff',
  '.ttf': 'font/ttf',
  '.png': 'image/png',
  '.jpe': 'image/jpg',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpg',
  '.jpg': 'image/jpg',
  '.webp': 'image/webp',
}

export const getContentType = (filePath: string): string => {
  return textMimeType[extname(filePath)] || 'text/plain'
}
