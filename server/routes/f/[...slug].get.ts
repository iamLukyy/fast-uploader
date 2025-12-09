import { getFileByStoredName, getFileByThumbnailName } from '../../utils/db'
import { getFileStream, fileExists } from '../../utils/storage'

export default defineEventHandler(async (event) => {
  const slugParam = getRouterParam(event, 'slug')
  
  // Debug log
  console.log('Route /f/ called, slug param:', slugParam, 'type:', typeof slugParam)
  
  // Handle array or string
  const slug = Array.isArray(slugParam) ? slugParam.join('/') : slugParam

  if (!slug) {
    throw createError({
      statusCode: 400,
      message: 'Filename is required'
    })
  }

  // Security: prevent path traversal
  if (slug.includes('..')) {
    throw createError({
      statusCode: 400,
      message: 'Invalid filename'
    })
  }

  // Try to find file by stored_name first
  let file = getFileByStoredName(slug)
  let isThumbnail = false

  // If not found, try thumbnail_name
  if (!file) {
    file = getFileByThumbnailName(slug)
    isThumbnail = true
  }

  // For thumbnails, serve directly from disk even if not in DB
  if (!file && slug.startsWith('thumb_')) {
    if (!fileExists(slug)) {
      throw createError({
        statusCode: 404,
        message: 'Thumbnail not found on disk'
      })
    }
    
    const stream = getFileStream(slug)
    if (!stream) {
      throw createError({
        statusCode: 500,
        message: 'Could not read thumbnail'
      })
    }

    setHeader(event, 'Content-Type', 'image/jpeg')
    setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')
    return sendStream(event, stream)
  }

  if (!file) {
    throw createError({
      statusCode: 404,
      message: 'File not found in database'
    })
  }

  const filename = isThumbnail ? file.thumbnail_name! : file.stored_name

  if (!fileExists(filename)) {
    throw createError({
      statusCode: 404,
      message: 'File not found on storage'
    })
  }

  const stream = getFileStream(filename)

  if (!stream) {
    throw createError({
      statusCode: 500,
      message: 'Could not read file'
    })
  }

  // Set headers
  if (isThumbnail) {
    setHeader(event, 'Content-Type', 'image/jpeg')
  } else {
    setHeader(event, 'Content-Type', file.mime_type)
    setHeader(event, 'Content-Length', file.size.toString())
    setHeader(event, 'Content-Disposition', `inline; filename="${encodeURIComponent(file.original_name)}"`)
  }
  setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')

  return sendStream(event, stream)
})
