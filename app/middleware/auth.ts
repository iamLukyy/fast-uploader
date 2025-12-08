export default defineNuxtRouteMiddleware(async () => {
  const { authenticated, checkSession, loading } = useAuth()

  // Check session if not already loaded
  if (loading.value) {
    await checkSession()
  }

  if (!authenticated.value) {
    return navigateTo('/login')
  }
})
