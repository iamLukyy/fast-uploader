import type { FileItem } from './useFiles'

export interface UploadItem {
  id: string
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'complete' | 'error'
  error?: string
  result?: FileItem
  xhr?: XMLHttpRequest
}

export const useUpload = () => {
  const uploads = useState<UploadItem[]>('upload-items', () => [])

  const uploadFile = (file: File): Promise<FileItem> => {
    return new Promise((resolve, reject) => {
      const id = crypto.randomUUID()
      const xhr = new XMLHttpRequest()

      const uploadItem: UploadItem = {
        id,
        file,
        progress: 0,
        status: 'pending',
        xhr
      }

      uploads.value = [...uploads.value, uploadItem]

      const updateUpload = (updates: Partial<UploadItem>) => {
        uploads.value = uploads.value.map(u =>
          u.id === id ? { ...u, ...updates } : u
        )
      }

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100)
          updateUpload({ progress, status: 'uploading' })
        }
      })

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText)
            updateUpload({
              status: 'complete',
              progress: 100,
              result: response.file
            })
            resolve(response.file)
          } catch {
            updateUpload({ status: 'error', error: 'Invalid response' })
            reject(new Error('Invalid response'))
          }
        } else {
          let errorMsg = 'Upload failed'
          try {
            const response = JSON.parse(xhr.responseText)
            errorMsg = response.message || errorMsg
          } catch { /* ignore */ }
          updateUpload({ status: 'error', error: errorMsg })
          reject(new Error(errorMsg))
        }
      })

      xhr.addEventListener('error', () => {
        updateUpload({ status: 'error', error: 'Network error' })
        reject(new Error('Network error'))
      })

      xhr.addEventListener('abort', () => {
        updateUpload({ status: 'error', error: 'Cancelled' })
        reject(new Error('Cancelled'))
      })

      const formData = new FormData()
      formData.append('file', file)

      xhr.open('POST', '/api/files')
      xhr.send(formData)
    })
  }

  const uploadFiles = async (files: File[]): Promise<FileItem[]> => {
    const results: FileItem[] = []

    for (const file of files) {
      try {
        const result = await uploadFile(file)
        results.push(result)
      } catch {
        // Continue with other files
      }
    }

    return results
  }

  const cancelUpload = (id: string) => {
    const upload = uploads.value.find(u => u.id === id)
    if (upload?.xhr && upload.status === 'uploading') {
      upload.xhr.abort()
    }
  }

  const removeUpload = (id: string) => {
    uploads.value = uploads.value.filter(u => u.id !== id)
  }

  const clearCompleted = () => {
    uploads.value = uploads.value.filter(u =>
      u.status !== 'complete' && u.status !== 'error'
    )
  }

  const retryUpload = async (id: string) => {
    const upload = uploads.value.find(u => u.id === id)
    if (!upload || upload.status !== 'error') return

    // Remove the failed upload
    removeUpload(id)

    // Try again
    try {
      await uploadFile(upload.file)
    } catch {
      // Error is handled in uploadFile
    }
  }

  const hasActiveUploads = computed(() =>
    uploads.value.some(u => u.status === 'pending' || u.status === 'uploading')
  )

  return {
    uploads: readonly(uploads),
    uploadFile,
    uploadFiles,
    cancelUpload,
    removeUpload,
    clearCompleted,
    retryUpload,
    hasActiveUploads
  }
}
