import { join, extname } from 'path'
import { mkdirSync, existsSync, writeFileSync, unlinkSync, createReadStream } from 'fs'
import { randomUUID } from 'crypto'

const DATA_DIR = process.env.NUXT_DATA_DIR || './data'
const UPLOADS_DIR = join(DATA_DIR, 'uploads')

// Ensure uploads directory exists
if (!existsSync(UPLOADS_DIR)) {
  mkdirSync(UPLOADS_DIR, { recursive: true })
}

// Max file size: 10 GB
export const MAX_FILE_SIZE = 10 * 1024 * 1024 * 1024

export interface StoredFile {
  id: string
  storedName: string
  path: string
}

export function storeFile(filename: string, data: Buffer): StoredFile {
  const id = randomUUID()
  const ext = extname(filename).toLowerCase() || ''
  const storedName = `${id}${ext}`
  const filePath = join(UPLOADS_DIR, storedName)

  writeFileSync(filePath, data)

  return {
    id,
    storedName,
    path: filePath
  }
}

export function getFilePath(storedName: string): string {
  return join(UPLOADS_DIR, storedName)
}

export function fileExists(storedName: string): boolean {
  return existsSync(getFilePath(storedName))
}

export function deleteStoredFile(storedName: string): boolean {
  const filePath = getFilePath(storedName)
  if (existsSync(filePath)) {
    unlinkSync(filePath)
    return true
  }
  return false
}

export function getFileStream(storedName: string) {
  const filePath = getFilePath(storedName)
  if (!existsSync(filePath)) {
    return null
  }
  return createReadStream(filePath)
}

export function sanitizeFilename(filename: string): string {
  // Remove path traversal attempts and dangerous characters
  return filename
    .replace(/[/\\]/g, '')
    .replace(/\.\./g, '')
    .trim()
}
