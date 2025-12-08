import { getFileByShortId } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const shortId = getRouterParam(event, 'id')

  if (!shortId) {
    throw createError({
      statusCode: 400,
      message: 'File ID is required'
    })
  }

  const file = getFileByShortId(shortId)

  if (!file) {
    throw createError({
      statusCode: 404,
      message: 'File not found'
    })
  }

  return {
    id: file.id,
    name: file.original_name,
    storedName: file.stored_name,
    mimeType: file.mime_type,
    size: file.size,
    uploadedAt: file.uploaded_at,
    shortId: file.short_id,
    exifData: file.exif_data ? JSON.parse(file.exif_data) : null,
    downloadUrl: `/f/${file.stored_name}`
  }
})
