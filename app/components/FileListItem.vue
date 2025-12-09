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
  <div class="group flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 hover:shadow-sm transition-shadow">
    <!-- Thumbnail/Icon -->
    <div v-if="isImage" class="w-8 h-8 rounded overflow-hidden flex-shrink-0">
      <img :src="thumbnailSrc" :alt="file.name" class="w-full h-full object-cover" loading="lazy" />
    </div>
    <div v-else class="w-8 h-8 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
      <UIcon :name="fileIcon" class="w-4 h-4 text-gray-500" />
    </div>

    <!-- File info -->
    <div class="flex-1 min-w-0">
      <a
        :href="fileUrl"
        target="_blank"
        class="text-sm font-medium truncate block hover:text-primary transition-colors"
        :title="file.name"
      >
        {{ file.name }}
      </a>
    </div>

    <!-- Size & Date -->
    <div class="hidden sm:block text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
      {{ formatSize(file.size) }}
    </div>
    <div class="hidden md:block text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
      {{ formattedDate }}
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <UButton
        v-tippy="'Copy direct link'"
        :icon="copiedDirect ? 'i-lucide-check' : 'i-lucide-link'"
        :color="copiedDirect ? 'success' : 'neutral'"
        variant="ghost"
        size="xs"
        class="cursor-pointer"
        @click="copyDirectLink"
      />
      <UButton
        v-tippy="'Copy share link'"
        :icon="copiedPage ? 'i-lucide-check' : 'i-lucide-share-2'"
        :color="copiedPage ? 'success' : 'neutral'"
        variant="ghost"
        size="xs"
        class="cursor-pointer"
        @click="copyPageLink"
      />
      <UButton
        v-tippy="'Open share page'"
        icon="i-lucide-external-link"
        color="neutral"
        variant="ghost"
        size="xs"
        :to="pageUrl"
        target="_blank"
        class="cursor-pointer"
      />
      <UButton
        v-tippy="'Delete'"
        icon="i-lucide-trash-2"
        color="neutral"
        variant="ghost"
        size="xs"
        class="cursor-pointer"
        @click="handleDelete"
      />
    </div>

    <!-- Delete confirmation modal -->
    <UModal v-model:open="showDeleteModal">
      <template #content>
        <div class="p-6 text-center">
          <UIcon name="i-lucide-alert-triangle" class="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 class="text-lg font-semibold mb-2 dark:text-white">Delete file?</h3>
          <p class="text-gray-500 dark:text-gray-400 mb-6 break-all">{{ file.name }}</p>
          <div class="flex gap-3 justify-center">
            <UButton color="neutral" variant="soft" class="cursor-pointer" @click="showDeleteModal = false">Cancel</UButton>
            <UButton color="error" class="cursor-pointer" @click="confirmDelete">Delete</UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
