<script setup lang="ts">
import type { FileItem } from '~/composables/useFiles'
import { getFileTypeIcon } from '~/utils/fileIcons'

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
const fileIcon = computed(() => getFileTypeIcon(props.file.mimeType, props.file.name))

const formattedDate = computed(() => {
  return new Date(props.file.uploadedAt).toLocaleString('cs-CZ', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
})

const isImage = computed(() => props.file.mimeType.startsWith('image/'))
const thumbnailSrc = computed(() => props.file.thumbnailUrl || fileUrl.value)

const showDeleteModal = ref(false)
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
    setTimeout(() => { copiedDirect.value = false }, 3000)
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
      title: 'Share link copied!',
      icon: 'i-lucide-check',
      color: 'success'
    })
    setTimeout(() => { copiedPage.value = false }, 3000)
  } catch {
    toast.add({
      title: 'Failed to copy',
      icon: 'i-lucide-x',
      color: 'error'
    })
  }
}

function handleDelete() {
  showDeleteModal.value = true
}

function confirmDelete() {
  showDeleteModal.value = false
  emit('delete')
}
</script>

<template>
  <div class="group flex items-center gap-4 bg-white dark:bg-gray-800/30 rounded-xl border border-gray-200/60 dark:border-gray-700/40 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/60 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200">
    <!-- Thumbnail/VSCode Icon -->
    <div v-if="isImage" class="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 ring-1 ring-gray-200/50 dark:ring-gray-700/50">
      <img :src="thumbnailSrc" :alt="file.name" class="w-full h-full object-cover" loading="lazy" />
    </div>
    <div v-else class="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center flex-shrink-0">
      <Icon :name="fileIcon" class="w-5 h-5" />
    </div>

    <!-- File info -->
    <div class="flex-1 min-w-0">
      <a
        :href="fileUrl"
        target="_blank"
        class="text-sm font-medium truncate block hover:text-primary transition-colors duration-150"
        :title="file.name"
      >
        {{ file.name }}
      </a>
    </div>

    <!-- Size & Date -->
    <div class="hidden sm:block text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
      {{ formatSize(file.size) }}
    </div>
    <div class="hidden md:block text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
      {{ formattedDate }}
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <UTooltip :delay-duration="0" text="Copy direct link">
        <UButton
          :icon="copiedDirect ? 'i-lucide-check' : 'i-lucide-link'"
          :color="copiedDirect ? 'success' : 'neutral'"
          variant="ghost"
          size="xs"
          class="cursor-pointer active:scale-95 transition-transform"
          @click="copyDirectLink"
        />
      </UTooltip>
      <UTooltip :delay-duration="0" text="Copy share link">
        <UButton
          :icon="copiedPage ? 'i-lucide-check' : 'i-lucide-share-2'"
          :color="copiedPage ? 'success' : 'neutral'"
          variant="ghost"
          size="xs"
          class="cursor-pointer active:scale-95 transition-transform"
          @click="copyPageLink"
        />
      </UTooltip>
      <UTooltip :delay-duration="0" text="Open share page">
        <UButton
          icon="i-lucide-external-link"
          color="neutral"
          variant="ghost"
          size="xs"
          :to="pageUrl"
          target="_blank"
          class="cursor-pointer active:scale-95 transition-transform"
        />
      </UTooltip>
      <UTooltip :delay-duration="0" text="Delete">
        <UButton
          icon="i-lucide-trash-2"
          color="neutral"
          variant="ghost"
          size="xs"
          class="cursor-pointer active:scale-95 transition-transform"
          @click="handleDelete"
        />
      </UTooltip>
    </div>

    <!-- Delete confirmation modal -->
    <UModal v-model:open="showDeleteModal">
      <template #content>
        <div class="p-8 text-center">
          <div class="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 mx-auto mb-6 flex items-center justify-center">
            <UIcon name="i-lucide-alert-triangle" class="w-8 h-8 text-red-500" />
          </div>
          <h3 class="text-xl font-semibold mb-2 dark:text-white">Delete file?</h3>
          <p class="text-gray-500 dark:text-gray-400 mb-8 break-all text-sm">{{ file.name }}</p>
          <div class="flex gap-3 justify-center">
            <UButton color="neutral" variant="soft" class="cursor-pointer active:scale-95 transition-transform px-6" @click="showDeleteModal = false">Cancel</UButton>
            <UButton color="error" class="cursor-pointer active:scale-95 transition-transform px-6" @click="confirmDelete">Delete</UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
