<script setup lang="ts">
import type { UploadItem } from '~/composables/useUpload'

const props = defineProps<{
  upload: UploadItem
}>()

const emit = defineEmits<{
  cancel: []
  remove: []
  retry: []
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
  <div
    class="flex items-center gap-4 p-4 rounded-xl border transition-all duration-300"
    :class="[
      upload.status === 'complete' && 'bg-green-50/50 dark:bg-green-900/10 border-green-200/50 dark:border-green-800/30',
      upload.status === 'error' && 'bg-red-50/50 dark:bg-red-900/10 border-red-200/50 dark:border-red-800/30',
      upload.status === 'uploading' && 'bg-gray-50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/30',
      upload.status === 'pending' && 'bg-gray-50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/30'
    ]"
  >
    <!-- Status icon with container -->
    <div
      class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
      :class="[
        upload.status === 'complete' && 'bg-green-100 dark:bg-green-900/30',
        upload.status === 'error' && 'bg-red-100 dark:bg-red-900/30',
        upload.status === 'uploading' && 'bg-primary/10',
        upload.status === 'pending' && 'bg-gray-100 dark:bg-gray-700'
      ]"
    >
      <UIcon
        :name="statusIcon"
        class="w-5 h-5"
        :class="[
          upload.status === 'uploading' && 'animate-spin text-primary',
          upload.status === 'complete' && 'text-green-500',
          upload.status === 'error' && 'text-red-500',
          upload.status === 'pending' && 'text-gray-400'
        ]"
      />
    </div>

    <div class="flex-1 min-w-0">
      <p class="text-sm font-medium truncate dark:text-white">{{ upload.file.name }}</p>
      <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
        <span>{{ formatSize(upload.file.size) }}</span>
        <span v-if="upload.status === 'uploading'" class="text-primary font-medium">
          {{ upload.progress }}%
        </span>
        <span v-else-if="upload.status === 'error'" class="text-red-500">
          {{ upload.error }}
        </span>
      </div>

      <!-- Custom gradient progress bar -->
      <div
        v-if="upload.status === 'uploading' || upload.status === 'pending'"
        class="mt-2 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
      >
        <div
          class="h-full bg-gradient-to-r from-zinc-600 to-zinc-400 dark:from-zinc-400 dark:to-zinc-300 rounded-full transition-all duration-300"
          :style="{ width: `${upload.progress}%` }"
        />
      </div>
    </div>

    <!-- Retry button for failed uploads -->
    <UButton
      v-if="upload.status === 'error'"
      icon="i-lucide-refresh-cw"
      color="error"
      variant="soft"
      size="xs"
      class="cursor-pointer active:scale-95 transition-transform"
      @click="emit('retry')"
    />

    <UButton
      v-if="upload.status === 'uploading'"
      icon="i-lucide-x"
      color="neutral"
      variant="ghost"
      size="xs"
      class="cursor-pointer active:scale-95 transition-transform"
      @click="emit('cancel')"
    />
    <UButton
      v-else-if="upload.status === 'complete' || upload.status === 'error'"
      icon="i-lucide-x"
      color="neutral"
      variant="ghost"
      size="xs"
      class="cursor-pointer active:scale-95 transition-transform"
      @click="emit('remove')"
    />
  </div>
</template>
