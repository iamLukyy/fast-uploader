import { requireAuth } from '../../utils/session'
import { insertFile } from '../../utils/db'
import { storeFile, MAX_FILE_SIZE, sanitizeFilename } from '../../utils/storage'
import { extractExif } from '../../utils/exif'
import { generateThumbnail } from '../../utils/thumbnail'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const formData = await readMultipartFormData(event)

  if (!formData || formData.length === 0) {
    throw createError({
      statusCode: 400,
      message: 'No file provided'
    })
  }

  const fileField = formData.find(f => f.name === 'file')

  if (!fileField || !fileField.data || !fileField.filename) {
    throw createError({
      statusCode: 400,
      message: 'Invalid file upload'
    })
  }

  // Validate file size
  if (fileField.data.length > MAX_FILE_SIZE) {
    throw createError({
      statusCode: 413,
      message: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`
    })
  }

  const originalName = sanitizeFilename(fileField.filename)
  const mimeType = fileField.type || 'application/octet-stream'

  // Store file
  const stored = storeFile(originalName, fileField.data)

  // Extract EXIF data for images
  const exifData = await extractExif(stored.storedName, mimeType)

  // Generate thumbnail for large images
  const thumbnailName = await generateThumbnail(stored.storedName, mimeType)

  // Insert into database
  const record = insertFile({
    id: stored.id,
    original_name: originalName,
    stored_name: stored.storedName,
    mime_type: mimeType,
    size: fileField.data.length,
    exif_data: exifData,
    thumbnail_name: thumbnailName
  })

  return {
    file: {
      id: record.id,
      name: record.original_name,
      storedName: record.stored_name,
      mimeType: record.mime_type,
      size: record.size,
      uploadedAt: record.uploaded_at,
      shortId: record.short_id,
      exifData: record.exif_data ? JSON.parse(record.exif_data) : null,
      thumbnailUrl: record.thumbnail_name ? `/f/${record.thumbnail_name}` : null
    }
  }
})
