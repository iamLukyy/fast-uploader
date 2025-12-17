// File extension to VSCode Icons mapping (50+ types)
const fileTypeIconMap: Record<string, string> = {
  // Documents
  'pdf': 'vscode-icons:file-type-pdf2',
  'doc': 'vscode-icons:file-type-word',
  'docx': 'vscode-icons:file-type-word',
  'xls': 'vscode-icons:file-type-excel',
  'xlsx': 'vscode-icons:file-type-excel',
  'ppt': 'vscode-icons:file-type-powerpoint',
  'pptx': 'vscode-icons:file-type-powerpoint',
  'odt': 'vscode-icons:file-type-word',
  'ods': 'vscode-icons:file-type-excel',
  'odp': 'vscode-icons:file-type-powerpoint',
  'rtf': 'vscode-icons:file-type-word',
  'csv': 'vscode-icons:file-type-excel',

  // Images
  'jpg': 'vscode-icons:file-type-image',
  'jpeg': 'vscode-icons:file-type-image',
  'png': 'vscode-icons:file-type-image',
  'gif': 'vscode-icons:file-type-image',
  'webp': 'vscode-icons:file-type-image',
  'bmp': 'vscode-icons:file-type-image',
  'ico': 'vscode-icons:file-type-image',
  'tiff': 'vscode-icons:file-type-image',
  'tif': 'vscode-icons:file-type-image',
  'svg': 'vscode-icons:file-type-svg',
  'psd': 'vscode-icons:file-type-photoshop',
  'ai': 'vscode-icons:file-type-ai',
  'sketch': 'vscode-icons:file-type-sketch',
  'fig': 'vscode-icons:file-type-figma',
  'xd': 'vscode-icons:file-type-xd',
  'raw': 'vscode-icons:file-type-image',
  'cr2': 'vscode-icons:file-type-image',
  'nef': 'vscode-icons:file-type-image',

  // Video
  'mp4': 'vscode-icons:file-type-video',
  'mkv': 'vscode-icons:file-type-video',
  'avi': 'vscode-icons:file-type-video',
  'mov': 'vscode-icons:file-type-video',
  'wmv': 'vscode-icons:file-type-video',
  'flv': 'vscode-icons:file-type-video',
  'webm': 'vscode-icons:file-type-video',
  'm4v': 'vscode-icons:file-type-video',

  // Audio
  'mp3': 'vscode-icons:file-type-audio',
  'wav': 'vscode-icons:file-type-audio',
  'flac': 'vscode-icons:file-type-audio',
  'ogg': 'vscode-icons:file-type-audio',
  'aac': 'vscode-icons:file-type-audio',
  'm4a': 'vscode-icons:file-type-audio',
  'wma': 'vscode-icons:file-type-audio',
  'aiff': 'vscode-icons:file-type-audio',

  // Archives
  'zip': 'vscode-icons:file-type-zip',
  'rar': 'vscode-icons:file-type-zip',
  '7z': 'vscode-icons:file-type-zip',
  'tar': 'vscode-icons:file-type-zip',
  'gz': 'vscode-icons:file-type-zip',
  'bz2': 'vscode-icons:file-type-zip',
  'xz': 'vscode-icons:file-type-zip',
  'tgz': 'vscode-icons:file-type-zip',

  // Code - JavaScript/TypeScript
  'js': 'vscode-icons:file-type-js-official',
  'mjs': 'vscode-icons:file-type-js-official',
  'cjs': 'vscode-icons:file-type-js-official',
  'jsx': 'vscode-icons:file-type-reactjs',
  'ts': 'vscode-icons:file-type-typescript-official',
  'tsx': 'vscode-icons:file-type-reactts',
  'vue': 'vscode-icons:file-type-vue',
  'svelte': 'vscode-icons:file-type-svelte',

  // Code - Web
  'html': 'vscode-icons:file-type-html',
  'htm': 'vscode-icons:file-type-html',
  'css': 'vscode-icons:file-type-css',
  'scss': 'vscode-icons:file-type-scss',
  'sass': 'vscode-icons:file-type-sass',
  'less': 'vscode-icons:file-type-less',

  // Code - Data
  'json': 'vscode-icons:file-type-json',
  'xml': 'vscode-icons:file-type-xml',
  'yml': 'vscode-icons:file-type-yaml',
  'yaml': 'vscode-icons:file-type-yaml',
  'toml': 'vscode-icons:file-type-toml',

  // Code - Backend
  'py': 'vscode-icons:file-type-python',
  'rb': 'vscode-icons:file-type-ruby',
  'php': 'vscode-icons:file-type-php3',
  'java': 'vscode-icons:file-type-java',
  'kt': 'vscode-icons:file-type-kotlin',
  'scala': 'vscode-icons:file-type-scala',
  'go': 'vscode-icons:file-type-go',
  'rs': 'vscode-icons:file-type-rust',
  'swift': 'vscode-icons:file-type-swift',
  'c': 'vscode-icons:file-type-c3',
  'cpp': 'vscode-icons:file-type-cpp3',
  'h': 'vscode-icons:file-type-cheader',
  'hpp': 'vscode-icons:file-type-cppheader',
  'cs': 'vscode-icons:file-type-csharp2',

  // Code - Shell/Scripts
  'sh': 'vscode-icons:file-type-shell',
  'bash': 'vscode-icons:file-type-shell',
  'zsh': 'vscode-icons:file-type-shell',
  'ps1': 'vscode-icons:file-type-powershell',
  'bat': 'vscode-icons:file-type-bat',
  'cmd': 'vscode-icons:file-type-bat',

  // Code - Database
  'sql': 'vscode-icons:file-type-sql',
  'db': 'vscode-icons:file-type-sql',
  'sqlite': 'vscode-icons:file-type-sql',

  // Text
  'txt': 'vscode-icons:file-type-text',
  'md': 'vscode-icons:file-type-markdown',
  'mdx': 'vscode-icons:file-type-mdx',
  'log': 'vscode-icons:file-type-log',

  // Config
  'env': 'vscode-icons:file-type-dotenv',
  'gitignore': 'vscode-icons:file-type-git',
  'dockerignore': 'vscode-icons:file-type-docker2',
  'dockerfile': 'vscode-icons:file-type-docker2',
  'lock': 'vscode-icons:file-type-lock',

  // Fonts
  'ttf': 'vscode-icons:file-type-font',
  'otf': 'vscode-icons:file-type-font',
  'woff': 'vscode-icons:file-type-font',
  'woff2': 'vscode-icons:file-type-font',
  'eot': 'vscode-icons:file-type-font',

  // Executables
  'exe': 'vscode-icons:file-type-binary',
  'msi': 'vscode-icons:file-type-binary',
  'dmg': 'vscode-icons:file-type-binary',
  'pkg': 'vscode-icons:file-type-binary',
  'deb': 'vscode-icons:file-type-binary',
  'rpm': 'vscode-icons:file-type-binary',
  'apk': 'vscode-icons:file-type-binary',
  'app': 'vscode-icons:file-type-binary',

  // Other
  'iso': 'vscode-icons:file-type-binary',
  'torrent': 'vscode-icons:file-type-binary',
  'ics': 'vscode-icons:file-type-text',
  'vcf': 'vscode-icons:file-type-text'
}

// MIME type fallbacks for when extension is not available
const mimeTypeIconMap: Record<string, string> = {
  'image': 'vscode-icons:file-type-image',
  'video': 'vscode-icons:file-type-video',
  'audio': 'vscode-icons:file-type-audio',
  'text': 'vscode-icons:file-type-text',
  'application/pdf': 'vscode-icons:file-type-pdf2',
  'application/json': 'vscode-icons:file-type-json',
  'application/xml': 'vscode-icons:file-type-xml',
  'application/zip': 'vscode-icons:file-type-zip',
  'application/x-rar': 'vscode-icons:file-type-zip',
  'application/x-7z': 'vscode-icons:file-type-zip'
}

/**
 * Get VSCode-style file type icon for a file
 * Returns icon name from vscode-icons collection
 */
export function getFileTypeIcon(mimeType: string, filename?: string): string {
  const ext = filename?.split('.').pop()?.toLowerCase()

  // First try extension-based lookup
  if (ext && fileTypeIconMap[ext]) {
    return fileTypeIconMap[ext]
  }

  // Try MIME type prefix (image/, video/, etc.)
  const mimePrefix = mimeType.split('/')[0]
  if (mimeTypeIconMap[mimePrefix]) {
    return mimeTypeIconMap[mimePrefix]
  }

  // Try full MIME type
  if (mimeTypeIconMap[mimeType]) {
    return mimeTypeIconMap[mimeType]
  }

  // Default file icon
  return 'vscode-icons:default-file'
}

/**
 * Get Lucide icon for file type (legacy, used in file list)
 */
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
