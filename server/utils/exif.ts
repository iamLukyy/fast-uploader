import exifr from 'exifr'
import type { ExifData } from './db'
import { getFilePath } from './storage'

const IMAGE_TYPES_WITH_EXIF = [
  'image/jpeg',
  'image/tiff',
  'image/heic',
  'image/heif',
  'image/x-fuji-raf',
  'image/x-canon-cr2',
  'image/x-canon-cr3',
  'image/x-nikon-nef',
  'image/x-sony-arw',
  'image/x-panasonic-rw2',
  'image/x-olympus-orf',
  'image/x-adobe-dng',
]

export function canHaveExif(mimeType: string): boolean {
  return IMAGE_TYPES_WITH_EXIF.some(t => mimeType === t) ||
         mimeType.startsWith('image/')
}

function formatShutterSpeed(exposureTime?: number): string | undefined {
  if (!exposureTime) return undefined
  if (exposureTime >= 1) return `${exposureTime}s`
  return `1/${Math.round(1 / exposureTime)}`
}

export async function extractExif(storedName: string, mimeType: string): Promise<ExifData | null> {
  if (!canHaveExif(mimeType)) {
    return null
  }

  const filePath = getFilePath(storedName)

  try {
    const data = await exifr.parse(filePath, {
      tiff: true,
      exif: true,
      gps: true,
      ifd0: true,
      translateKeys: true,
      translateValues: true,
      reviveValues: true,
    })

    if (!data) return null

    return {
      make: data.Make || undefined,
      model: data.Model || undefined,
      shutterSpeed: formatShutterSpeed(data.ExposureTime),
      aperture: data.FNumber || undefined,
      iso: data.ISO || undefined,
      focalLength: data.FocalLength ? `${Math.round(data.FocalLength)}mm` : undefined,
      width: data.ImageWidth || data.ExifImageWidth || undefined,
      height: data.ImageHeight || data.ExifImageHeight || undefined,
      latitude: data.latitude || undefined,
      longitude: data.longitude || undefined,
    }
  } catch {
    return null
  }
}
