import { requireAuth } from '../../utils/session'
import { getAllFiles } from '../../utils/db'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const query = getQuery(event)
  const limit = Math.min(Number(query.limit) || 50, 100)
  const offset = Number(query.offset) || 0

  const { files, total } = getAllFiles(limit, offset)

  return {
    files: files.map(f => ({
      id: f.id,
      name: f.original_name,
      storedName: f.stored_name,
      mimeType: f.mime_type,
      size: f.size,
      uploadedAt: f.uploaded_at,
      shortId: f.short_id,
      exifData: f.exif_data ? JSON.parse(f.exif_data) : null,
      thumbnailUrl: f.thumbnail_name ? `/f/${f.thumbnail_name}` : null
    })),
    total,
    limit,
    offset
  }
})
