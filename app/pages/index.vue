<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})

const { files, total, loading, fetchFiles, deleteFile, addFile } = useFiles()
const { uploads, uploadFiles, cancelUpload, removeUpload, clearCompleted, hasActiveUploads } = useUpload()
const toast = useToast()

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
        <UButton
          icon="i-lucide-refresh-cw"
          color="neutral"
          variant="ghost"
          size="xs"
          :loading="loading"
          @click="fetchFiles()"
        />
      </div>

      <!-- Loading -->
      <div v-if="loading && files.length === 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <USkeleton v-for="i in 6" :key="i" class="h-32" />
      </div>

      <!-- Empty State -->
      <div
        v-else-if="files.length === 0"
        class="text-center py-12 text-gray-500"
      >
        <UIcon name="i-lucide-folder-open" class="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>No files uploaded yet</p>
        <p class="text-sm">Drop some files above to get started</p>
      </div>

      <!-- File Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <FileCard
          v-for="file in files"
          :key="file.id"
          :file="file"
          @delete="handleDeleteFile(file.id)"
        />
      </div>
    </section>
  </div>
</template>
