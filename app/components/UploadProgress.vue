<script setup lang="ts">
import type { UploadItem } from '~/composables/useUpload'

const props = defineProps<{
  upload: UploadItem
}>()

const emit = defineEmits<{
  cancel: []
  remove: []
}>()

const { formatSize } = useFiles()

const statusColor = computed(() => {
  switch (props.upload.status) {
    case 'complete': return 'success'
    case 'error': return 'error'
    case 'uploading': return 'primary'
    default: return 'neutral'
  }
})

const statusIcon = computed(() => {
  switch (props.upload.status) {
    case 'complete': return 'i-lucide-check-circle'
    case 'error': return 'i-lucide-x-circle'
    case 'uploading': return 'i-lucide-loader-2'
    default: return 'i-lucide-clock'
  }
})
</script>

<template>
  <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
    <UIcon
      :name="statusIcon"
      class="w-5 h-5 flex-shrink-0"
      :class="[
        upload.status === 'uploading' && 'animate-spin',
        statusColor === 'success' && 'text-green-500',
        statusColor === 'error' && 'text-red-500',
        statusColor === 'primary' && 'text-primary',
        statusColor === 'neutral' && 'text-gray-400'
      ]"
    />

    <div class="flex-1 min-w-0">
      <p class="text-sm font-medium truncate">{{ upload.file.name }}</p>
      <div class="flex items-center gap-2 text-xs text-gray-500">
        <span>{{ formatSize(upload.file.size) }}</span>
        <span v-if="upload.status === 'uploading'">{{ upload.progress }}%</span>
        <span v-else-if="upload.status === 'error'" class="text-red-500">
          {{ upload.error }}
        </span>
      </div>

      <UProgress
        v-if="upload.status === 'uploading' || upload.status === 'pending'"
        :value="upload.progress"
        size="xs"
        class="mt-1"
      />
    </div>

    <UButton
      v-if="upload.status === 'uploading'"
      icon="i-lucide-x"
      color="neutral"
      variant="ghost"
      size="xs"
      @click="emit('cancel')"
    />
    <UButton
      v-else-if="upload.status === 'complete' || upload.status === 'error'"
      icon="i-lucide-x"
      color="neutral"
      variant="ghost"
      size="xs"
      @click="emit('remove')"
    />
  </div>
</template>
