<script setup lang="ts">
definePageMeta({
  layout: false
})

const { login, authenticated, checkSession } = useAuth()
const password = ref('')
const error = ref('')
const submitting = ref(false)
const showPassword = ref(false)

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
  <div class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <!-- Animated background blobs -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-900/30 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-70 animate-blob" />
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 dark:bg-blue-900/30 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 dark:bg-indigo-900/30 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
    </div>

    <!-- Login card -->
    <div class="relative w-full max-w-md">
      <div class="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 rounded-3xl shadow-2xl p-8 md:p-10 border border-white/20 dark:border-gray-700/50">
        <!-- Logo & Title -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg mb-6">
            <UIcon name="i-lucide-cloud-upload" class="w-10 h-10 text-white" />
          </div>
          <h1 class="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            Fast Uploader
          </h1>
          <p class="text-gray-500 dark:text-gray-400 mt-2">
            Enter password to access your files
          </p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Password input -->
          <div class="relative">
            <div class="relative">
              <UInput
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter password"
                autofocus
                :disabled="submitting"
                size="xl"
                :ui="{
                  base: 'w-full pl-12 pr-12',
                  rounded: 'rounded-xl',
                  padding: { xl: 'py-4' }
                }"
                class="w-full"
              />
              <div class="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <UIcon name="i-lucide-lock" class="w-5 h-5 text-gray-400" />
              </div>
              <button
                type="button"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
                @click="showPassword = !showPassword"
              >
                <UIcon :name="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'" class="w-5 h-5" />
              </button>
            </div>

            <!-- Error message -->
            <Transition
              enter-active-class="transition-all duration-200 ease-out"
              enter-from-class="opacity-0 -translate-y-2"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition-all duration-150 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 -translate-y-2"
            >
              <div v-if="error" class="flex items-center gap-2 mt-3 text-red-500 text-sm">
                <UIcon name="i-lucide-alert-circle" class="w-4 h-4" />
                {{ error }}
              </div>
            </Transition>
          </div>

          <!-- Submit button -->
          <UButton
            type="submit"
            block
            size="xl"
            :loading="submitting"
            :disabled="!password || submitting"
            :ui="{
              rounded: 'rounded-xl',
              padding: { xl: 'py-4' }
            }"
            class="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/25 cursor-pointer"
          >
            <template #leading>
              <UIcon v-if="!submitting" name="i-lucide-log-in" class="w-5 h-5" />
            </template>
            {{ submitting ? 'Signing in...' : 'Sign in' }}
          </UButton>
        </form>

        <!-- Footer -->
        <p class="text-center text-xs text-gray-400 dark:text-gray-500 mt-8">
          Secure file sharing made simple
        </p>
      </div>
    </div>
  </div>
</template>

<style>
@keyframes blob {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(20px, -30px) scale(1.1); }
  50% { transform: translate(-20px, 20px) scale(0.9); }
  75% { transform: translate(30px, 10px) scale(1.05); }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
</style>
