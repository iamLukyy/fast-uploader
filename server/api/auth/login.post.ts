import { getSession } from '../../utils/session'

const AUTH_PASSWORD = process.env.NUXT_AUTH_PASSWORD

if (!AUTH_PASSWORD) {
  throw createError({
    statusCode: 500,
    message: 'Server not configured'
  })
}

export default defineEventHandler(async (event) => {
  const body = await readBody<{ password?: string }>(event)

  if (!body?.password) {
    throw createError({
      statusCode: 400,
      message: 'Password is required'
    })
  }

  if (body.password !== AUTH_PASSWORD) {
    throw createError({
      statusCode: 401,
      message: 'Invalid password'
    })
  }

  const session = await getSession(event)
  await session.update({ authenticated: true })

  return { success: true }
})
