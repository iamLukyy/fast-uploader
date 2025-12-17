import sharp from 'sharp'
import { statSync, existsSync } from 'fs'
import { getFilePath } from './storage'

const THUMBNAIL_SIZE = 200
const THUMBNAIL_QUALITY = 80
const MIN_SIZE_FOR_THUMBNAIL = 500 * 1024 // 500KB

// Image types that can be thumbnailed
const SUPPORTED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif'
]

export async function generateThumbnail(
  storedName: string,
  mimeType: string
): Promise<string | null> {
  // Only for supported image types
  if (!SUPPORTED_TYPES.includes(mimeType)) {
    return null
  }

  const filePath = getFilePath(storedName)

  // Check if file exists
  if (!existsSync(filePath)) {
    return null
  }

  // Skip small files - they don't need thumbnails
  const stats = statSync(filePath)
  if (stats.size < MIN_SIZE_FOR_THUMBNAIL) {
    return null
  }

  // Generate thumbnail name
  const thumbnailName = `thumb_${storedName}`
  const thumbnailPath = getFilePath(thumbnailName)

  try {
    await sharp(filePath)
      .resize(THUMBNAIL_SIZE, THUMBNAIL_SIZE, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: THUMBNAIL_QUALITY })
      .toFile(thumbnailPath)

    return thumbnailName
  } catch (error) {
    console.error('Failed to generate thumbnail:', error)
    return null
  }
}
