<script setup lang="ts">
const emit = defineEmits<{
  filesSelected: [files: File[]]
}>()

const isDragOver = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

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
</script>

<template>
  <div
    class="relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200"
    :class="[
      isDragOver
        ? 'border-primary bg-primary/5 scale-[1.02]'
        : 'border-gray-300 dark:border-gray-600 hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-gray-800'
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
      Max 500 MB per file
    </p>
  </div>
</template>
