export interface ExifData {
  make?: string
  model?: string
  shutterSpeed?: string
  aperture?: number
  iso?: number
  focalLength?: string
  width?: number
  height?: number
}

export interface FileItem {
  id: string
  name: string
  storedName: string
  mimeType: string
  size: number
  uploadedAt: string
  shortId: string | null
  exifData: ExifData | null
  thumbnailUrl: string | null
}

export const useFiles = () => {
  const files = useState<FileItem[]>('files-list', () => [])
  const total = useState('files-total', () => 0)
  const loading = useState('files-loading', () => false)
  const error = useState<string | null>('files-error', () => null)

  const config = useRuntimeConfig()
  const baseUrl = config.public.baseUrl || ''

  const fetchFiles = async (limit = 50, offset = 0) => {
    loading.value = true
    error.value = null

    try {
      const data = await $fetch<{
        files: FileItem[]
        total: number
      }>('/api/files', {
        query: { limit, offset }
      })

      files.value = data.files
      total.value = data.total
    } catch (e) {
      error.value = 'Failed to load files'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  const deleteFile = async (id: string): Promise<boolean> => {
    try {
      await $fetch(`/api/files/${id}`, { method: 'DELETE' })
      files.value = files.value.filter(f => f.id !== id)
      total.value--
      return true
    } catch {
      return false
    }
  }

  const getPublicUrl = (file: FileItem): string => {
    return `${baseUrl}/f/${file.storedName}`
  }

  const getPageUrl = (file: FileItem): string => {
    if (!file.shortId) return getPublicUrl(file)
    return `${baseUrl}/s/${file.shortId}`
  }

  const addFile = (file: FileItem) => {
    files.value = [file, ...files.value]
    total.value++
  }

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
  }

  return {
    files: readonly(files),
    total: readonly(total),
    loading: readonly(loading),
    error: readonly(error),
    fetchFiles,
    deleteFile,
    getPublicUrl,
    getPageUrl,
    addFile,
    formatSize
  }
}
