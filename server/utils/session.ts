import type { H3Event } from 'h3'
import { useSession, createError } from 'h3'

function getSessionConfig() {
  const password = process.env.NUXT_SESSION_SECRET
  if (!password || password.length < 32) {
    throw new Error('NUXT_SESSION_SECRET must be set and at least 32 characters')
  }
  return {
    name: 'fast-uploader-session',
    password,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: 60 * 60 * 24 * 7 // 7 days
    }
  }
}

export interface SessionData {
  authenticated?: boolean
}

export async function getSession(event: H3Event) {
  return await useSession<SessionData>(event, getSessionConfig())
}

export async function requireAuth(event: H3Event) {
  const session = await getSession(event)
  if (!session.data.authenticated) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }
  return session
}
