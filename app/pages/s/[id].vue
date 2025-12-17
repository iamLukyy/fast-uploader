<script setup lang="ts">
import { getFileTypeIcon } from '~/utils/fileIcons'

definePageMeta({
  layout: false
})

const route = useRoute()
const colorMode = useColorMode()

const isDark = computed({
  get: () => colorMode.value === 'dark',
  set: (v) => { colorMode.preference = v ? 'dark' : 'light' }
})

const toast = useToast()

const { data: file, error, pending } = await useFetch(`/api/public/${route.params.id}`)

const fileIcon = computed(() => {
  if (!file.value) return 'vscode-icons:default-file'
  return getFileTypeIcon(file.value.mimeType, file.value.name)
})

function formatUploadDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('cs-CZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

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

const hasGps = computed(() => {
  if (!file.value?.exifData) return false
  const exif = file.value.exifData
  return typeof exif.latitude === 'number' && typeof exif.longitude === 'number'
})

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
}

const autoDownloadEnabled = ref(false)

function startDownload() {
  if (!file.value) return
  const link = document.createElement('a')
  link.href = file.value.downloadUrl
  link.download = file.value.name
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  toast.add({
    title: 'Stahování zahájeno',
    icon: 'i-lucide-download',
    color: 'success'
  })
}

function saveAutoDownload(value: boolean) {
  localStorage.setItem('autoDownload', value.toString())

  if (value && file.value) {
    // Zapnuto - stáhnout soubor hned
    const link = document.createElement('a')
    link.href = file.value.downloadUrl
    link.download = file.value.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.add({
      title: 'Automatické stahování zapnuto',
      icon: 'i-lucide-toggle-right',
      color: 'success'
    })
  } else if (!value) {
    // Vypnuto
    toast.add({
      title: 'Automatické stahování vypnuto',
      icon: 'i-lucide-toggle-left',
      color: 'neutral'
    })
  }
}

onMounted(() => {
  // Načíst preference z localStorage
  autoDownloadEnabled.value = localStorage.getItem('autoDownload') === 'true'

  // Spustit download jen pokud je povoleno
  if (autoDownloadEnabled.value && file.value && !error.value) {
    setTimeout(startDownload, 500)
  }
})
</script>

<template>
  <div class="min-h-screen bg-gradient-subtle flex flex-col transition-colors duration-300">
    <!-- Glass header -->
    <header class="glass border-b border-gray-200/50 dark:border-gray-700/50">
      <div class="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-3">
          <div class="p-2 rounded-xl bg-primary/10 dark:bg-primary/20 glow-primary">
            <UIcon name="i-lucide-arrow-down-to-line" class="w-5 h-5 text-primary" />
          </div>
          <span class="font-bold text-lg">Drop</span>
        </NuxtLink>

        <ClientOnly>
          <UTooltip :delay-duration="0" :text="isDark ? 'Light mode' : 'Dark mode'">
            <UButton
              :icon="isDark ? 'i-lucide-sun' : 'i-lucide-moon'"
              color="neutral"
              variant="ghost"
              size="sm"
              class="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
              @click="isDark = !isDark"
            />
          </UTooltip>
          <template #fallback>
            <div class="size-8" />
          </template>
        </ClientOnly>
      </div>
    </header>

    <!-- Content -->
    <main class="flex-1 flex items-center justify-center px-6 py-12">
      <!-- Loading state -->
      <div v-if="pending" class="w-full max-w-2xl">
        <USkeleton class="h-64 rounded-2xl" />
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="text-center">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-red-100 dark:bg-red-900/20 mb-6">
          <UIcon name="i-lucide-file-x" class="w-10 h-10 text-red-500" />
        </div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">File not found</h1>
        <p class="text-gray-500 dark:text-gray-400">This file may have been deleted or the link is invalid.</p>
      </div>

      <!-- File display -->
      <div v-else-if="file" class="w-full max-w-2xl">
        <div class="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200/80 dark:border-gray-700/50 p-8 shadow-elevated">
          <!-- File type icon (large) - for non-previewable files -->
          <div v-if="!isPreviewableImage" class="flex justify-center mb-4">
            <Icon :name="fileIcon" class="w-24 h-24" />
          </div>

          <!-- Filename -->
          <h1 class="text-xl font-bold text-gray-900 dark:text-white text-center mb-2 break-all">
            {{ file.name }}
          </h1>

          <!-- Upload date -->
          <p class="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">
            Nahráno {{ formatUploadDate(file.uploadedAt) }}
          </p>

          <!-- Image preview -->
          <div v-if="isPreviewableImage" class="mb-6 flex flex-col items-center gap-3">
            <a :href="file.downloadUrl" target="_blank" class="block cursor-pointer group">
              <img
                :src="file.downloadUrl"
                :alt="file.name"
                loading="lazy"
                class="max-w-full max-h-96 rounded-xl shadow-elevated group-hover:shadow-float group-hover:scale-[1.01] transition-all duration-300 ring-1 ring-gray-200/50 dark:ring-gray-700/50"
              />
            </a>
            <span class="text-xs text-gray-400 dark:text-gray-500">Click image to open full size</span>
          </div>

          <!-- EXIF data -->
          <div v-if="hasExif" class="mb-6 py-4 border-t border-b border-gray-200 dark:border-gray-700">
            <ExifDisplay :exif="file.exifData" />
          </div>

          <!-- Location map -->
          <div v-if="hasGps" class="mb-6">
            <ClientOnly>
              <LocationMap :latitude="file.exifData.latitude" :longitude="file.exifData.longitude" />
            </ClientOnly>
          </div>

          <!-- File info -->
          <p class="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">
            {{ formatSize(file.size) }}
          </p>

          <!-- Download section -->
          <div class="text-center space-y-4">
            <!-- Hlavní download tlačítko -->
            <UButton
              icon="i-lucide-download"
              size="lg"
              class="cursor-pointer active:scale-95 transition-transform glow-primary"
              @click="startDownload"
            >
              Stáhnout soubor
            </UButton>

            <!-- Auto-download toggle -->
            <label class="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 cursor-pointer">
              <span>Automatické stahování</span>
              <USwitch v-model="autoDownloadEnabled" :ui="{ base: 'cursor-pointer' }" @update:model-value="saveAutoDownload" />
            </label>
          </div>
        </div>
      </div>
    </main>

    <!-- Minimal footer -->
    <footer class="border-t border-gray-200/50 dark:border-gray-700/50">
      <div class="max-w-5xl mx-auto px-6 py-4 flex items-center justify-center">
        <span class="text-sm text-gray-400 dark:text-gray-500">
          Vibecoded by
          <a
            href="https://github.com/iamLukyy"
            target="_blank"
            class="text-primary hover:text-primary/80 transition-colors"
          >Luky</a>
        </span>
      </div>
    </footer>
  </div>
</template>
