<script setup lang="ts">
definePageMeta({
  layout: false
})

const route = useRoute()
const colorMode = useColorMode()

const isDark = computed({
  get: () => colorMode.value === 'dark',
  set: (v) => { colorMode.preference = v ? 'dark' : 'light' }
})

const { data: file, error } = await useFetch(`/api/public/${route.params.id}`)

const isPreviewableImage = computed(() => {
  if (!file.value) return false
  return ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.value.mimeType)
})

const isImageWithExif = computed(() => {
  if (!file.value) return false
  return file.value.mimeType.startsWith('image/') && file.value.exifData
})

const hasExif = computed(() => {
  if (!file.value?.exifData) return false
  const exif = file.value.exifData
  return exif.make || exif.model || exif.shutterSpeed || exif.aperture || exif.iso || exif.focalLength
})

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
}

const downloadStarted = ref(false)

function startDownload() {
  if (!file.value) return
  const link = document.createElement('a')
  link.href = file.value.downloadUrl
  link.download = file.value.name
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  downloadStarted.value = true
}

onMounted(() => {
  if (file.value && !error.value) {
    setTimeout(startDownload, 500)
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
    <!-- Header -->
    <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2">
          <UIcon name="i-lucide-upload-cloud" class="w-6 h-6 text-primary" />
          <span class="font-bold">Fast Uploader</span>
        </NuxtLink>

        <UButton
          :icon="isDark ? 'i-lucide-sun' : 'i-lucide-moon'"
          color="neutral"
          variant="ghost"
          class="cursor-pointer"
          @click="isDark = !isDark"
        />
      </div>
    </header>

    <!-- Content -->
    <main class="flex-1 flex items-center justify-center px-4 py-12">
      <!-- Error state -->
      <div v-if="error" class="text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
          <UIcon name="i-lucide-file-x" class="w-8 h-8 text-red-500" />
        </div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">File not found</h1>
        <p class="text-gray-500 dark:text-gray-400">This file may have been deleted or the link is invalid.</p>
      </div>

      <!-- File display -->
      <div v-else-if="file" class="w-full max-w-2xl">
        <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-sm">
          <!-- Filename -->
          <h1 class="text-xl font-bold text-gray-900 dark:text-white text-center mb-6 break-all">
            {{ file.name }}
          </h1>

          <!-- Image preview -->
          <div v-if="isPreviewableImage" class="mb-6 flex flex-col items-center gap-2">
            <a :href="file.downloadUrl" target="_blank" class="block cursor-pointer group">
              <img
                :src="file.downloadUrl"
                class="max-w-full max-h-96 rounded-lg shadow-md group-hover:shadow-xl group-hover:scale-[1.02] transition-all duration-200"
              />
            </a>
            <span class="text-xs text-gray-400 dark:text-gray-500">Click image to open full size</span>
          </div>

          <!-- Non-previewable image icon -->
          <div v-else-if="isImageWithExif" class="flex justify-center mb-6">
            <div class="w-24 h-24 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <UIcon name="i-lucide-image" class="w-12 h-12 text-gray-400" />
            </div>
          </div>

          <!-- EXIF data -->
          <div v-if="hasExif" class="mb-6 py-4 border-t border-b border-gray-200 dark:border-gray-700">
            <ExifDisplay :exif="file.exifData" />
          </div>

          <!-- File info -->
          <p class="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">
            {{ formatSize(file.size) }}
          </p>

          <!-- Download message -->
          <div class="text-center">
            <p v-if="downloadStarted" class="text-gray-600 dark:text-gray-300">
              Your file will begin downloading automatically.
            </p>
            <p v-else class="text-gray-600 dark:text-gray-300">
              Your download will start shortly.
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Don't see it?
              <a
                :href="file.downloadUrl"
                :download="file.name"
                class="text-primary hover:underline cursor-pointer"
              >Click here</a>.
            </p>
          </div>
        </div>

        <!-- Branding -->
        <p class="text-center text-sm text-gray-400 dark:text-gray-500 mt-6">
          Uploaded with
          <NuxtLink to="/" class="text-primary hover:underline">Fast Uploader</NuxtLink>
        </p>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div class="max-w-5xl mx-auto px-4 py-3 flex items-center justify-center">
        <span class="text-sm text-gray-500 dark:text-gray-400">
          Vibecoded by
          <a
            href="https://github.com/iamLukyy"
            target="_blank"
            class="text-primary hover:underline"
          >Luky</a>
        </span>
      </div>
    </footer>
  </div>
</template>
