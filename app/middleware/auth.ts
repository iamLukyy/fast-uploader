export default defineNuxtRouteMiddleware(async () => {
  const { authenticated, checkSession } = useAuth()

  await checkSession()

  if (!authenticated.value) {
    return navigateTo('/login')
  }
})
