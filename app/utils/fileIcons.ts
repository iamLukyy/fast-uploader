export function getFileIcon(mimeType: string, filename?: string): string {
  const ext = filename?.split('.').pop()?.toLowerCase()

  // Images
  if (mimeType.startsWith('image/')) return 'i-lucide-image'

  // Video
  if (mimeType.startsWith('video/')) return 'i-lucide-video'

  // Audio
  if (mimeType.startsWith('audio/')) return 'i-lucide-music'

  // PDF
  if (mimeType.includes('pdf')) return 'i-lucide-file-text'

  // Word documents
  if (mimeType.includes('word') || mimeType.includes('document') ||
      ext === 'doc' || ext === 'docx' || ext === 'odt') {
    return 'i-lucide-file-text'
  }

  // Excel/Spreadsheets
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet') ||
      ext === 'xls' || ext === 'xlsx' || ext === 'ods' || ext === 'csv') {
    return 'i-lucide-file-spreadsheet'
  }

  // PowerPoint/Presentations
  if (mimeType.includes('powerpoint') || mimeType.includes('presentation') ||
      ext === 'ppt' || ext === 'pptx' || ext === 'odp') {
    return 'i-lucide-file-image'
  }

  // Archives
  if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('tar') ||
      mimeType.includes('gzip') || mimeType.includes('7z') || mimeType.includes('compressed') ||
      ['zip', 'rar', 'tar', 'gz', '7z', 'bz2', 'xz'].includes(ext || '')) {
    return 'i-lucide-archive'
  }

  // Code files
  if (mimeType.includes('javascript') || mimeType.includes('json') ||
      mimeType.includes('typescript') || mimeType.includes('html') ||
      mimeType.includes('css') || mimeType.includes('xml') ||
      ['js', 'ts', 'jsx', 'tsx', 'html', 'css', 'json', 'xml', 'yml', 'yaml',
       'py', 'rb', 'go', 'rs', 'java', 'c', 'cpp', 'h', 'php', 'vue', 'svelte'].includes(ext || '')) {
    return 'i-lucide-file-code'
  }

  // Text files
  if (mimeType.includes('text/') || ext === 'txt' || ext === 'md' || ext === 'rtf') {
    return 'i-lucide-file-text'
  }

  // Executables
  if (ext === 'exe' || ext === 'msi' || ext === 'dmg' || ext === 'app' || ext === 'deb' || ext === 'rpm') {
    return 'i-lucide-file-cog'
  }

  // Fonts
  if (mimeType.includes('font') || ['ttf', 'otf', 'woff', 'woff2', 'eot'].includes(ext || '')) {
    return 'i-lucide-type'
  }

  // Default
  return 'i-lucide-file'
}

export function isPreviewableImage(mimeType: string): boolean {
  return ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'].includes(mimeType)
}
