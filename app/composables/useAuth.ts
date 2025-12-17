export const useAuth = () => {
  const authenticated = useState('auth-authenticated', () => false)
  const loading = useState('auth-loading', () => true)

  const checkSession = async () => {
    loading.value = true
    try {
      const { authenticated: isAuth } = await $fetch('/api/auth/session', {
        headers: import.meta.server ? useRequestHeaders(['cookie']) : {}
      })
      authenticated.value = isAuth
    } catch {
      authenticated.value = false
    } finally {
      loading.value = false
    }
  }

  const login = async (password: string): Promise<boolean> => {
    try {
      await $fetch('/api/auth/login', {
        method: 'POST',
        body: { password }
      })
      authenticated.value = true
      return true
    } catch {
      return false
    }
  }

  const logout = async () => {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
    } finally {
      authenticated.value = false
    }
  }

  return {
    authenticated: readonly(authenticated),
    loading: readonly(loading),
    checkSession,
    login,
    logout
  }
}
