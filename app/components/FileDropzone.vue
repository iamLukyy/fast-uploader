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
    class="relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300"
    :class="[
      isDragOver
        ? 'border-primary bg-primary/5 dark:bg-primary/10 scale-[1.01] shadow-elevated ring-2 ring-primary/20'
        : 'border-gray-300 dark:border-gray-600 hover:border-primary/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 hover:shadow-subtle'
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

    <!-- Icon with glow container -->
    <div
      class="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 transition-all duration-300"
      :class="isDragOver ? 'bg-primary/10 glow-primary' : 'bg-gray-100 dark:bg-gray-800'"
    >
      <UIcon
        name="i-lucide-upload-cloud"
        class="w-8 h-8 transition-all duration-300"
        :class="isDragOver ? 'text-primary scale-110' : 'text-gray-400'"
      />
    </div>

    <p class="text-lg font-semibold mb-2">
      {{ isDragOver ? 'Drop files here' : 'Drag & drop files' }}
    </p>
    <p class="text-sm text-gray-500 dark:text-gray-400">
      or <span class="text-primary font-medium">click to browse</span>
    </p>
    <p class="text-xs text-gray-400 dark:text-gray-500 mt-3">
      Max 10 GB per file · Ctrl+V to paste
    </p>
  </div>

  <!-- Paste preview modal -->
  <UModal v-model:open="showPasteModal">
    <template #content>
      <div class="p-8">
        <div class="flex items-center gap-3 mb-6">
          <div class="p-2.5 rounded-xl bg-primary/10 dark:bg-primary/20">
            <UIcon name="i-lucide-clipboard-paste" class="w-5 h-5 text-primary" />
          </div>
          <h3 class="text-lg font-semibold dark:text-white">Upload pasted image?</h3>
        </div>

        <!-- Image preview -->
        <div v-if="pastedPreviewUrl" class="mb-6 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 ring-1 ring-gray-200/50 dark:ring-gray-700/50">
          <img
            :src="pastedPreviewUrl"
            :alt="pastedFile?.name || 'Pasted image'"
            class="max-h-72 w-full object-contain"
          />
        </div>

        <!-- File info -->
        <p v-if="pastedFile" class="text-sm text-gray-500 dark:text-gray-400 mb-6 truncate">
          {{ pastedFile.name }}
        </p>

        <div class="flex gap-3 justify-end">
          <UButton
            color="neutral"
            variant="soft"
            class="cursor-pointer active:scale-95 transition-transform"
            @click="closePasteModal"
          >
            Cancel
          </UButton>
          <UButton
            color="primary"
            class="cursor-pointer active:scale-95 transition-transform"
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
