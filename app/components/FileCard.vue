<script setup lang="ts">
import type { FileItem } from '~/composables/useFiles'
import { getFileIcon } from '~/utils/fileIcons'

const props = defineProps<{
  file: FileItem
}>()

const emit = defineEmits<{
  delete: []
}>()

const { getPublicUrl, getPageUrl, formatSize } = useFiles()
const toast = useToast()

const fileUrl = computed(() => getPublicUrl(props.file))
const pageUrl = computed(() => getPageUrl(props.file))

const fileIcon = computed(() => getFileIcon(props.file.mimeType, props.file.name))

const formattedDate = computed(() => {
  return new Date(props.file.uploadedAt).toLocaleDateString('cs-CZ', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
})

const copiedDirect = ref(false)
const copiedPage = ref(false)

async function copyDirectLink() {
  try {
    await navigator.clipboard.writeText(fileUrl.value)
    copiedDirect.value = true
    toast.add({
      title: 'Direct link copied!',
      icon: 'i-lucide-check',
      color: 'success'
    })
    setTimeout(() => { copiedDirect.value = false }, 2000)
  } catch {
    toast.add({
      title: 'Failed to copy',
      icon: 'i-lucide-x',
      color: 'error'
    })
  }
}

async function copyPageLink() {
  try {
    await navigator.clipboard.writeText(pageUrl.value)
    copiedPage.value = true
    toast.add({
      title: 'Page link copied!',
      icon: 'i-lucide-check',
      color: 'success'
    })
    setTimeout(() => { copiedPage.value = false }, 2000)
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
      <!-- Copy Direct Link -->
      <UButton
        :icon="copiedDirect ? 'i-lucide-check' : 'i-lucide-link'"
        :color="copiedDirect ? 'success' : 'neutral'"
        variant="soft"
        size="xs"
        class="cursor-pointer flex-1"
        @click="copyDirectLink"
      >
        {{ copiedDirect ? 'Copied!' : 'Direct' }}
      </UButton>

      <!-- Copy Page Link -->
      <UButton
        :icon="copiedPage ? 'i-lucide-check' : 'i-lucide-share'"
        :color="copiedPage ? 'success' : 'primary'"
        variant="soft"
        size="xs"
        class="cursor-pointer flex-1"
        @click="copyPageLink"
      >
        {{ copiedPage ? 'Copied!' : 'Share' }}
      </UButton>

      <!-- Open -->
      <UButton
        icon="i-lucide-external-link"
        color="neutral"
        variant="soft"
        size="xs"
        :to="pageUrl"
        target="_blank"
        class="cursor-pointer"
      />

      <!-- Delete -->
      <UButton
        :icon="confirmDelete ? 'i-lucide-check' : 'i-lucide-trash-2'"
        :color="confirmDelete ? 'error' : 'neutral'"
        :variant="confirmDelete ? 'solid' : 'soft'"
        size="xs"
        class="cursor-pointer"
        @click="handleDelete"
      />
    </div>
  </div>
</template>
