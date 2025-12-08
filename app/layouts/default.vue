<script setup lang="ts">
const { logout } = useAuth()
const colorMode = useColorMode()

const isDark = computed({
  get: () => colorMode.value === 'dark',
  set: (v) => { colorMode.preference = v ? 'dark' : 'light' }
})

async function handleLogout() {
  await logout()
  navigateTo('/login')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
    <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-upload-cloud" class="w-6 h-6 text-primary" />
          <span class="font-bold">Fast Uploader</span>
        </div>

        <div class="flex items-center gap-2">
          <UButton
            :icon="isDark ? 'i-lucide-sun' : 'i-lucide-moon'"
            color="neutral"
            variant="ghost"
            class="cursor-pointer"
            @click="isDark = !isDark"
          />
          <UButton
            icon="i-lucide-log-out"
            color="neutral"
            variant="ghost"
            class="cursor-pointer"
            @click="handleLogout"
          />
        </div>
      </div>
    </header>

    <main class="flex-1 max-w-5xl mx-auto px-4 py-6 w-full">
      <slot />
    </main>

    <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div class="max-w-5xl mx-auto px-4 py-3 flex items-center justify-center">
        <span class="text-sm text-gray-500 dark:text-gray-400">
          Vibecoded by
          <a
            href="https://github.com/iamLukyy"
            target="_blank"
            class="text-primary hover:underline"
          >Luky</a>
        </span>
      </div>
    </footer>
  </div>
</template>
