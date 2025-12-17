<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})

const { files, total, loading, fetchFiles, deleteFile, addFile } = useFiles()
const { uploads, uploadFiles, cancelUpload, removeUpload, clearCompleted, hasActiveUploads, retryUpload } = useUpload()
const toast = useToast()

// View mode (grid/list) - persisted in localStorage
const viewMode = useState<'grid' | 'list'>('viewMode', () => 'grid')

onMounted(() => {
  const saved = localStorage.getItem('viewMode')
  if (saved === 'grid' || saved === 'list') {
    viewMode.value = saved
  }
})

watch(viewMode, (val) => {
  localStorage.setItem('viewMode', val)
})

// Fetch files on mount
onMounted(() => {
  fetchFiles()
})

async function handleFilesSelected(selectedFiles: File[]) {
  const results = await uploadFiles(selectedFiles)

  for (const file of results) {
    addFile(file)
  }

  if (results.length > 0) {
    toast.add({
      title: `${results.length} file${results.length > 1 ? 's' : ''} uploaded`,
      icon: 'i-lucide-check',
      color: 'success'
    })
  }
}

async function handleDeleteFile(id: string) {
  const success = await deleteFile(id)
  if (success) {
    toast.add({
      title: 'File deleted',
      icon: 'i-lucide-trash-2',
      color: 'neutral'
    })
  } else {
    toast.add({
      title: 'Failed to delete',
      icon: 'i-lucide-x',
      color: 'error'
    })
  }
}

// Active uploads (excluding completed)
const activeUploads = computed(() =>
  uploads.value.filter(u => u.status !== 'complete')
)
</script>

<template>
  <div class="space-y-6">
    <!-- Upload Section -->
    <section>
      <FileDropzone @files-selected="handleFilesSelected" />

      <!-- Upload Progress -->
      <div v-if="activeUploads.length > 0" class="mt-4 space-y-2">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-medium">Uploading</h3>
          <UButton
            v-if="!hasActiveUploads && activeUploads.length > 0"
            size="xs"
            variant="ghost"
            @click="clearCompleted"
          >
            Clear
          </UButton>
        </div>

        <UploadProgress
          v-for="upload in activeUploads"
          :key="upload.id"
          :upload="upload"
          @cancel="cancelUpload(upload.id)"
          @remove="removeUpload(upload.id)"
          @retry="retryUpload(upload.id)"
        />
      </div>
    </section>

    <!-- Files Section -->
    <section>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold">
          Files
          <span v-if="total > 0" class="text-sm font-normal text-gray-500">
            ({{ total }})
          </span>
        </h2>
        <div class="flex items-center gap-1">
          <!-- View toggle -->
          <div class="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
            <UTooltip :delay-duration="0" text="Grid view">
              <UButton
                icon="i-lucide-grid-2x2"
                :color="viewMode === 'grid' ? 'primary' : 'neutral'"
                :variant="viewMode === 'grid' ? 'solid' : 'ghost'"
                size="xs"
                class="cursor-pointer"
                @click="viewMode = 'grid'"
              />
            </UTooltip>
            <UTooltip :delay-duration="0" text="List view">
              <UButton
                icon="i-lucide-list"
                :color="viewMode === 'list' ? 'primary' : 'neutral'"
                :variant="viewMode === 'list' ? 'solid' : 'ghost'"
                size="xs"
                class="cursor-pointer"
                @click="viewMode = 'list'"
              />
            </UTooltip>
          </div>
          <UTooltip :delay-duration="0" text="Refresh">
            <UButton
              icon="i-lucide-refresh-cw"
              color="neutral"
              variant="ghost"
              size="xs"
              :loading="loading"
              class="cursor-pointer"
              @click="fetchFiles()"
            />
          </UTooltip>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading && files.length === 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <USkeleton v-for="i in 6" :key="i" class="h-32" />
      </div>

      <!-- Empty State -->
      <div
        v-else-if="files.length === 0"
        class="text-center py-16 text-gray-500 dark:text-gray-400"
      >
        <div class="relative inline-block">
          <UIcon name="i-lucide-cloud-upload" class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 animate-bounce" />
        </div>
        <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">Žádné soubory</h3>
        <p class="text-sm mt-1">Přetáhněte soubory výše nebo klikněte pro výběr</p>
      </div>

      <!-- File Grid -->
      <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <FileCard
          v-for="file in files"
          :key="file.id"
          :file="file"
          @delete="handleDeleteFile(file.id)"
        />
      </div>

      <!-- File List -->
      <div v-else class="space-y-2">
        <FileListItem
          v-for="file in files"
          :key="file.id"
          :file="file"
          @delete="handleDeleteFile(file.id)"
        />
      </div>
    </section>
  </div>
</template>
