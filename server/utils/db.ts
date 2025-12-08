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

export interface FileRecord {
  id: string
  original_name: string
  stored_name: string
  mime_type: string
  size: number
  uploaded_at: string
}

export function insertFile(file: Omit<FileRecord, 'uploaded_at'>): FileRecord {
  const stmt = db.prepare(`
    INSERT INTO files (id, original_name, stored_name, mime_type, size)
    VALUES (?, ?, ?, ?, ?)
  `)
  stmt.run(file.id, file.original_name, file.stored_name, file.mime_type, file.size)

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
