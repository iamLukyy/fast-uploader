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

const isImage = computed(() => {
  return props.file.mimeType.startsWith('image/')
})

// Použít thumbnail pokud existuje, jinak plnou URL
const thumbnailSrc = computed(() => {
  return props.file.thumbnailUrl || fileUrl.value
})

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
      title: 'Page link copied!',
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
  <div class="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
    <div class="flex items-start gap-3">
      <!-- Thumbnail pro obrázky, ikona pro ostatní -->
      <div v-if="isImage" class="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
        <img :src="thumbnailSrc" :alt="file.name" class="w-full h-full object-cover" loading="lazy" />
      </div>
      <div v-else class="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
        <UIcon :name="fileIcon" class="w-5 h-5 text-gray-500" />
      </div>

      <div class="flex-1 min-w-0">
        <a
          :href="fileUrl"
          target="_blank"
          class="text-sm font-medium truncate block hover:text-primary transition-colors"
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
        icon="i-lucide-trash-2"
        color="neutral"
        variant="soft"
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
          <h3 class="text-lg font-semibold mb-2 dark:text-white">Smazat soubor?</h3>
          <p class="text-gray-500 dark:text-gray-400 mb-6 break-all">{{ file.name }}</p>
          <div class="flex gap-3 justify-center">
            <UButton color="neutral" variant="soft" class="cursor-pointer" @click="showDeleteModal = false">Zrušit</UButton>
            <UButton color="error" class="cursor-pointer" @click="confirmDelete">Smazat</UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
