<script setup lang="ts">
interface ExifData {
  make?: string
  model?: string
  shutterSpeed?: string
  aperture?: number
  iso?: number
  focalLength?: string
}

defineProps<{
  exif: ExifData
}>()
</script>

<template>
  <div class="flex flex-wrap gap-6 justify-center text-sm">
    <div v-if="exif.make || exif.model" class="text-center">
      <span class="font-bold text-gray-900 dark:text-white block">Camera</span>
      <span class="text-gray-500 dark:text-gray-400">
        {{ [exif.make, exif.model].filter(Boolean).join(' ') }}
      </span>
    </div>
    <div v-if="exif.shutterSpeed" class="text-center">
      <span class="font-bold text-gray-900 dark:text-white block">Shutter</span>
      <span class="text-gray-500 dark:text-gray-400">{{ exif.shutterSpeed }}</span>
    </div>
    <div v-if="exif.aperture" class="text-center">
      <span class="font-bold text-gray-900 dark:text-white block">Aperture</span>
      <span class="text-gray-500 dark:text-gray-400">f/{{ exif.aperture }}</span>
    </div>
    <div v-if="exif.iso" class="text-center">
      <span class="font-bold text-gray-900 dark:text-white block">ISO</span>
      <span class="text-gray-500 dark:text-gray-400">{{ exif.iso }}</span>
    </div>
    <div v-if="exif.focalLength" class="text-center">
      <span class="font-bold text-gray-900 dark:text-white block">Focal</span>
      <span class="text-gray-500 dark:text-gray-400">{{ exif.focalLength }}</span>
    </div>
  </div>
</template>
