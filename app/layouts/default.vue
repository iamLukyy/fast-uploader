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
  <div class="min-h-screen bg-gradient-subtle flex flex-col transition-colors duration-300">
    <!-- Sticky glass header -->
    <header class="sticky top-0 z-50 glass border-b border-gray-200/50 dark:border-gray-700/50">
      <div class="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <!-- Logo with glow effect -->
          <div class="p-2 rounded-xl bg-primary/10 dark:bg-primary/20 glow-primary">
            <UIcon name="i-lucide-arrow-down-to-line" class="w-5 h-5 text-primary" />
          </div>
          <span class="font-bold text-lg">Drop</span>
        </div>

        <div class="flex items-center gap-1">
          <ClientOnly>
            <UTooltip :delay-duration="0" :text="isDark ? 'Light mode' : 'Dark mode'">
              <UButton
                :icon="isDark ? 'i-lucide-sun' : 'i-lucide-moon'"
                color="neutral"
                variant="ghost"
                size="sm"
                class="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                @click="isDark = !isDark"
              />
            </UTooltip>
            <template #fallback>
              <div class="size-8" />
            </template>
          </ClientOnly>
          <UTooltip :delay-duration="0" text="Logout">
            <UButton
              icon="i-lucide-log-out"
              color="neutral"
              variant="ghost"
              size="sm"
              class="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
              @click="handleLogout"
            />
          </UTooltip>
        </div>
      </div>
    </header>

    <main class="flex-1 max-w-5xl mx-auto px-6 py-8 w-full">
      <slot />
    </main>

    <!-- Minimal footer -->
    <footer class="border-t border-gray-200/50 dark:border-gray-700/50">
      <div class="max-w-5xl mx-auto px-6 py-4 flex items-center justify-center">
        <span class="text-sm text-gray-400 dark:text-gray-500">
          Vibecoded by
          <a
            href="https://github.com/iamLukyy"
            target="_blank"
            class="text-primary hover:text-primary/80 transition-colors"
          >Luky</a>
        </span>
      </div>
    </footer>
  </div>
</template>
