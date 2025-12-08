import { getFileByStoredName } from '../../utils/db'
import { getFileStream, fileExists } from '../../utils/storage'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({
      statusCode: 400,
      message: 'Filename is required'
    })
  }

  // Security: prevent path traversal
  if (slug.includes('..') || slug.includes('/') || slug.includes('\\')) {
    throw createError({
      statusCode: 400,
      message: 'Invalid filename'
    })
  }

  const file = getFileByStoredName(slug)

  if (!file) {
    throw createError({
      statusCode: 404,
      message: 'File not found'
    })
  }

  if (!fileExists(file.stored_name)) {
    throw createError({
      statusCode: 404,
      message: 'File not found on storage'
    })
  }

  const stream = getFileStream(file.stored_name)

  if (!stream) {
    throw createError({
      statusCode: 500,
      message: 'Could not read file'
    })
  }

  // Set headers for download
  setHeader(event, 'Content-Type', file.mime_type)
  setHeader(event, 'Content-Length', file.size.toString())
  setHeader(event, 'Content-Disposition', `inline; filename="${encodeURIComponent(file.original_name)}"`)
  setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')

  return sendStream(event, stream)
})
