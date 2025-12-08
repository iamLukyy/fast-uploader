<script setup lang="ts">
import type { FileItem } from '~/composables/useFiles'

const props = defineProps<{
  file: FileItem
}>()

const emit = defineEmits<{
  delete: []
}>()

const { getPublicUrl, formatSize } = useFiles()
const toast = useToast()

const fileUrl = computed(() => getPublicUrl(props.file))

const fileIcon = computed(() => {
  const type = props.file.mimeType
  if (type.startsWith('image/')) return 'i-lucide-image'
  if (type.startsWith('video/')) return 'i-lucide-video'
  if (type.startsWith('audio/')) return 'i-lucide-music'
  if (type.includes('pdf')) return 'i-lucide-file-text'
  if (type.includes('zip') || type.includes('rar') || type.includes('tar')) return 'i-lucide-archive'
  if (type.includes('text') || type.includes('json')) return 'i-lucide-file-code'
  return 'i-lucide-file'
})

const formattedDate = computed(() => {
  return new Date(props.file.uploadedAt).toLocaleDateString('cs-CZ', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
})

async function copyLink() {
  try {
    await navigator.clipboard.writeText(fileUrl.value)
    toast.add({
      title: 'Link copied!',
      icon: 'i-lucide-check',
      color: 'success'
    })
  } catch {
    toast.add({
      title: 'Failed to copy',
      icon: 'i-lucide-x',
      color: 'error'
    })
  }
}

const confirmDelete = ref(false)

function handleDelete() {
  if (!confirmDelete.value) {
    confirmDelete.value = true
    setTimeout(() => { confirmDelete.value = false }, 3000)
    return
  }
  emit('delete')
}
</script>

<template>
  <div class="group bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
    <div class="flex items-start gap-3">
      <div class="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
        <UIcon :name="fileIcon" class="w-5 h-5 text-gray-500" />
      </div>

      <div class="flex-1 min-w-0">
        <a
          :href="fileUrl"
          target="_blank"
          class="text-sm font-medium truncate block hover:text-primary"
          :title="file.name"
        >
          {{ file.name }}
        </a>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {{ formatSize(file.size) }} · {{ formattedDate }}
        </p>
      </div>
    </div>

    <div class="flex gap-2 mt-3">
      <UButton
        icon="i-lucide-copy"
        color="primary"
        variant="soft"
        size="xs"
        block
        class="cursor-pointer"
        @click="copyLink"
      >
        Copy link
      </UButton>

      <UButton
        icon="i-lucide-download"
        color="neutral"
        variant="soft"
        size="xs"
        :to="fileUrl"
        target="_blank"
      >
        Open
      </UButton>

      <UButton
        :icon="confirmDelete ? 'i-lucide-check' : 'i-lucide-trash-2'"
        :color="confirmDelete ? 'error' : 'neutral'"
        :variant="confirmDelete ? 'solid' : 'soft'"
        size="xs"
        @click="handleDelete"
      />
    </div>
  </div>
</template>
