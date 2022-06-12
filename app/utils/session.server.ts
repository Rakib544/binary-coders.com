import { createCookieSessionStorage, redirect } from '@remix-run/node'
const sessionSecret = process.env.SESSION_SECRET

if (!sessionSecret) {
  throw new Error('Session secret must be set')
}
const storage = createCookieSessionStorage({
  cookie: {
    name: 'user_session',
    secure: process.env.NODE_ENV === 'production',
    secrets: [sessionSecret],
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
})

export const createUserSession = async (username: string, id: string, redirectTo: string) => {
  const session = await storage.getSession()
  session.set('userId', id)
  session.set('name', username)
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await storage.commitSession(session),
    },
  })
}

const getUserSession = (request: Request) => {
  return storage.getSession(request.headers.get('Cookie'))
}

export const getUserId = async (request: Request) => {
  const session = await getUserSession(request)

  const userId = session.get('userId')

  if (!userId || typeof userId === 'string') return null
  return userId
}

export const requireUserId = async (
  request: Request,
  redirectTo: string = new URL(request.url).pathname,
) => {
  const session = await getUserSession(request)
  const userId = session.get('userId')
  if (!userId || typeof userId !== 'string') {
    const searchParams = new URLSearchParams([['redirectTo', redirectTo]])
    throw redirect(`/auth/login?${searchParams}`)
  }
  return userId
}
