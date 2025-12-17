import Database from 'better-sqlite3'
import { join } from 'path'
import { mkdirSync, existsSync } from 'fs'

const DATA_DIR = process.env.NUXT_DATA_DIR || './data'
const DB_PATH = join(DATA_DIR, 'database.sqlite')

// Ensure data directory exists
if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true })
}

const db = new Database(DB_PATH)

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS files (
    id TEXT PRIMARY KEY,
    original_name TEXT NOT NULL,
    stored_name TEXT NOT NULL UNIQUE,
    mime_type TEXT NOT NULL,
    size INTEGER NOT NULL,
    uploaded_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE INDEX IF NOT EXISTS idx_files_uploaded_at ON files(uploaded_at DESC);
  CREATE INDEX IF NOT EXISTS idx_files_stored_name ON files(stored_name);
`)

// Migration: add new columns if they don't exist
try {
  db.exec(`ALTER TABLE files ADD COLUMN short_id TEXT`)
} catch { /* column already exists */ }
try {
  db.exec(`ALTER TABLE files ADD COLUMN exif_data TEXT`)
} catch { /* column already exists */ }
try {
  db.exec(`ALTER TABLE files ADD COLUMN thumbnail_name TEXT`)
} catch { /* column already exists */ }

// Create index on short_id after migration
db.exec(`CREATE INDEX IF NOT EXISTS idx_files_short_id ON files(short_id);`)

export interface ExifData {
  make?: string
  model?: string
  shutterSpeed?: string
  aperture?: number
  iso?: number
  focalLength?: string
  width?: number
  height?: number
  latitude?: number
  longitude?: number
}

export interface FileRecord {
  id: string
  original_name: string
  stored_name: string
  mime_type: string
  size: number
  uploaded_at: string
  short_id: string | null
  exif_data: string | null
  thumbnail_name: string | null
}

export function generateShortId(length = 6): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

function getUniqueShortId(): string {
  let shortId = generateShortId()
  let attempts = 0
  while (getFileByShortId(shortId) && attempts < 10) {
    shortId = generateShortId()
    attempts++
  }
  return shortId
}

export interface InsertFileData {
  id: string
  original_name: string
  stored_name: string
  mime_type: string
  size: number
  exif_data?: ExifData | null
  thumbnail_name?: string | null
}

export function insertFile(file: InsertFileData): FileRecord {
  const shortId = getUniqueShortId()
  const exifJson = file.exif_data ? JSON.stringify(file.exif_data) : null

  const stmt = db.prepare(`
    INSERT INTO files (id, original_name, stored_name, mime_type, size, short_id, exif_data, thumbnail_name)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `)
  stmt.run(file.id, file.original_name, file.stored_name, file.mime_type, file.size, shortId, exifJson, file.thumbnail_name || null)

  return getFileById(file.id)!
}

export function getFileById(id: string): FileRecord | undefined {
  const stmt = db.prepare('SELECT * FROM files WHERE id = ?')
  return stmt.get(id) as FileRecord | undefined
}

export function getFileByStoredName(storedName: string): FileRecord | undefined {
  const stmt = db.prepare('SELECT * FROM files WHERE stored_name = ?')
  return stmt.get(storedName) as FileRecord | undefined
}

export function getFileByShortId(shortId: string): FileRecord | undefined {
  const stmt = db.prepare('SELECT * FROM files WHERE short_id = ?')
  return stmt.get(shortId) as FileRecord | undefined
}

export function getAllFiles(limit = 100, offset = 0): { files: FileRecord[]; total: number } {
  const countStmt = db.prepare('SELECT COUNT(*) as count FROM files')
  const { count } = countStmt.get() as { count: number }

  const stmt = db.prepare('SELECT * FROM files ORDER BY uploaded_at DESC LIMIT ? OFFSET ?')
  const files = stmt.all(limit, offset) as FileRecord[]

  return { files, total: count }
}

export function deleteFile(id: string): boolean {
  const stmt = db.prepare('DELETE FROM files WHERE id = ?')
  const result = stmt.run(id)
  return result.changes > 0
}

export { db }

export function getFileByThumbnailName(thumbnailName: string): FileRecord | undefined {
  const stmt = db.prepare('SELECT * FROM files WHERE thumbnail_name = ?')
  return stmt.get(thumbnailName) as FileRecord | undefined
}
