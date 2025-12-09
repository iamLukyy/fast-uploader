<script setup lang="ts">
const emit = defineEmits<{
  filesSelected: [files: File[]]
}>()

const isDragOver = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

// Paste preview modal
const showPasteModal = ref(false)
const pastedFile = ref<File | null>(null)
const pastedPreviewUrl = ref<string | null>(null)

function handleDrop(e: DragEvent) {
  isDragOver.value = false
  const files = Array.from(e.dataTransfer?.files || [])
  if (files.length > 0) {
    emit('filesSelected', files)
  }
}

function handleDragOver(e: DragEvent) {
  e.preventDefault()
  isDragOver.value = true
}

function handleDragLeave() {
  isDragOver.value = false
}

function handleClick() {
  fileInput.value?.click()
}

function handleFileSelect(e: Event) {
  const input = e.target as HTMLInputElement
  const files = Array.from(input.files || [])
  if (files.length > 0) {
    emit('filesSelected', files)
  }
  // Reset input
  input.value = ''
}

// Handle Ctrl+V paste from clipboard
function handlePaste(e: ClipboardEvent) {
  const items = e.clipboardData?.items
  if (!items) return

  for (const item of items) {
    if (item.kind === 'file') {
      const file = item.getAsFile()
      if (file && file.type.startsWith('image/')) {
        // Generate filename for pasted images (e.g. screenshots)
        let finalFile = file
        if (file.name === 'image.png') {
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
          finalFile = new File([file], `screenshot-${timestamp}.png`, { type: file.type })
        }

        // Show preview modal instead of uploading directly
        pastedFile.value = finalFile
        pastedPreviewUrl.value = URL.createObjectURL(finalFile)
        showPasteModal.value = true
        return
      }
    }
  }
}

function confirmPasteUpload() {
  if (pastedFile.value) {
    emit('filesSelected', [pastedFile.value])
  }
  closePasteModal()
}

function closePasteModal() {
  showPasteModal.value = false
  if (pastedPreviewUrl.value) {
    URL.revokeObjectURL(pastedPreviewUrl.value)
  }
  pastedFile.value = null
  pastedPreviewUrl.value = null
}

onMounted(() => {
  document.addEventListener('paste', handlePaste)
})

onUnmounted(() => {
  document.removeEventListener('paste', handlePaste)
  if (pastedPreviewUrl.value) {
    URL.revokeObjectURL(pastedPreviewUrl.value)
  }
})
</script>

<template>
  <div
    class="relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200"
    :class="[
      isDragOver
        ? 'border-primary bg-primary/5 scale-[1.02] shadow-md'
        : 'border-gray-300 dark:border-gray-600 hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-md'
    ]"
    @drop.prevent="handleDrop"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @click="handleClick"
  >
    <input
      ref="fileInput"
      type="file"
      multiple
      class="hidden"
      @change="handleFileSelect"
    />

    <UIcon
      name="i-lucide-upload-cloud"
      class="w-12 h-12 mx-auto mb-4 transition-transform"
      :class="isDragOver ? 'text-primary scale-110' : 'text-gray-400'"
    />

    <p class="text-lg font-medium mb-1">
      {{ isDragOver ? 'Drop files here' : 'Drag & drop files' }}
    </p>
    <p class="text-sm text-gray-500 dark:text-gray-400">
      or click to browse
    </p>
    <p class="text-xs text-gray-400 dark:text-gray-500 mt-2">
      Max 500 MB per file · Ctrl+V to paste
    </p>
  </div>

  <!-- Paste preview modal -->
  <UModal v-model:open="showPasteModal">
    <template #content>
      <div class="p-6">
        <div class="flex items-center gap-3 mb-4">
          <UIcon name="i-lucide-clipboard-paste" class="w-6 h-6 text-primary" />
          <h3 class="text-lg font-semibold dark:text-white">Upload pasted image?</h3>
        </div>

        <!-- Image preview -->
        <div v-if="pastedPreviewUrl" class="mb-4 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img
            :src="pastedPreviewUrl"
            :alt="pastedFile?.name || 'Pasted image'"
            class="max-h-64 w-full object-contain"
          />
        </div>

        <!-- File info -->
        <p v-if="pastedFile" class="text-sm text-gray-500 dark:text-gray-400 mb-4 truncate">
          {{ pastedFile.name }}
        </p>

        <div class="flex gap-3 justify-end">
          <UButton
            color="neutral"
            variant="soft"
            class="cursor-pointer"
            @click="closePasteModal"
          >
            Cancel
          </UButton>
          <UButton
            color="primary"
            class="cursor-pointer"
            icon="i-lucide-upload"
            @click="confirmPasteUpload"
          >
            Upload
          </UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>
