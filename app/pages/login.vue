<script setup lang="ts">
definePageMeta({
  layout: false
})

const { login, authenticated, checkSession } = useAuth()
const password = ref('')
const error = ref('')
const submitting = ref(false)
const showPassword = ref(false)
const colorMode = useColorMode()

const isDark = computed({
  get: () => colorMode.value === 'dark',
  set: (v) => { colorMode.preference = v ? 'dark' : 'light' }
})

onMounted(async () => {
  await checkSession()
  if (authenticated.value) {
    navigateTo('/')
  }
})

async function handleLogin() {
  error.value = ''
  submitting.value = true

  try {
    const success = await login(password.value)
    if (success) {
      await navigateTo('/')
    } else {
      error.value = 'Invalid password'
      password.value = ''
    }
  } catch {
    error.value = 'Login failed'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-subtle flex flex-col transition-colors duration-300">
    <!-- Glass header -->
    <header class="glass border-b border-gray-200/50 dark:border-gray-700/50">
      <div class="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-xl bg-primary/10 dark:bg-primary/20 glow-primary">
            <UIcon name="i-lucide-arrow-down-to-line" class="w-5 h-5 text-primary" />
          </div>
          <span class="font-bold text-lg">Drop</span>
        </div>

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
      </div>
    </header>

    <!-- Login form -->
    <main class="flex-1 flex items-center justify-center px-6 py-12">
      <div class="w-full max-w-sm">
        <div class="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200/80 dark:border-gray-700/50 p-8 shadow-elevated">
          <!-- Logo & Title -->
          <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 dark:bg-primary/20 mb-5 glow-primary">
              <UIcon name="i-lucide-arrow-down-to-line" class="w-10 h-10 text-primary" />
            </div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              Welcome back
            </h1>
            <p class="text-gray-500 dark:text-gray-400 mt-2 text-sm">
              Enter password to continue
            </p>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleLogin" class="space-y-6">
            <!-- Password input -->
            <div>
              <div class="relative ring-glow rounded-xl">
                <UInput
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Password"
                  autofocus
                  :disabled="submitting"
                  size="lg"
                  class="w-full"
                  :ui="{
                    base: 'w-full pr-10',
                    rounded: 'rounded-xl'
                  }"
                />
                <button
                  type="button"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer transition-colors"
                  tabindex="-1"
                  @click="showPassword = !showPassword"
                >
                  <UIcon :name="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'" class="w-5 h-5" />
                </button>
              </div>

              <!-- Error message -->
              <p v-if="error" class="flex items-center gap-1.5 mt-3 text-red-500 text-sm">
                <UIcon name="i-lucide-alert-circle" class="w-4 h-4" />
                {{ error }}
              </p>
            </div>

            <!-- Submit button -->
            <UButton
              type="submit"
              block
              size="lg"
              :loading="submitting"
              :disabled="!password || submitting"
              class="cursor-pointer active:scale-[0.98] transition-transform"
            >
              Sign in
            </UButton>
          </form>
        </div>
      </div>
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
