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
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
    <!-- Header -->
    <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-upload-cloud" class="w-6 h-6 text-primary" />
          <span class="font-bold">Fast Uploader</span>
        </div>

        <UButton
          :icon="isDark ? 'i-lucide-sun' : 'i-lucide-moon'"
          color="neutral"
          variant="ghost"
          @click="isDark = !isDark"
        />
      </div>
    </header>

    <!-- Login form -->
    <main class="flex-1 flex items-center justify-center px-4 py-12">
      <div class="w-full max-w-sm">
        <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-sm">
          <!-- Logo & Title -->
          <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
              <UIcon name="i-lucide-upload-cloud" class="w-8 h-8 text-primary" />
            </div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              Welcome back
            </h1>
            <p class="text-gray-500 dark:text-gray-400 mt-1">
              Enter password to continue
            </p>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleLogin" class="space-y-5">
            <!-- Password input -->
            <div>
              <div class="relative">
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
                    rounded: 'rounded-lg'
                  }"
                />
                <button
                  type="button"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                  tabindex="-1"
                  @click="showPassword = !showPassword"
                >
                  <UIcon :name="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'" class="w-5 h-5" />
                </button>
              </div>

              <!-- Error message -->
              <p v-if="error" class="flex items-center gap-1.5 mt-2 text-red-500 text-sm">
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
              class="cursor-pointer"
            >
              Sign in
            </UButton>
          </form>
        </div>

        <p class="text-center text-sm text-gray-400 dark:text-gray-500 mt-6">
          Secure file sharing
        </p>
      </div>
    </main>
  </div>
</template>
