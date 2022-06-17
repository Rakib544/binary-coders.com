import { createCookieSessionStorage, redirect } from '@remix-run/node'
import { prisma } from './prisma.server'
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

export const createUserSession = async (
  username: string,
  id: string,
  profilePicture: string,
  redirectTo: string,
) => {
  const session = await storage.getSession()
  session.set('userId', id)
  session.set('name', username)
  session.set('profilePicture', profilePicture)
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

  if (!userId || typeof userId !== 'string') return null
  return userId
}

export const getUserName = async (request: Request) => {
  const session = await getUserSession(request)

  const username = session.get('name')

  if (!username || typeof username !== 'string') return null
  return username
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

export const logout = async (request: Request) => {
  const session = await getUserSession(request)
  return redirect('/auth/login', {
    headers: {
      'Set-Cookie': await storage.destroySession(session),
    },
  })
}

export const getUser = async (request: Request) => {
  const userId = await getUserId(request)
  if (typeof userId !== 'string') {
    return null
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        profilePicture: true,
      },
    })

    return user
  } catch (error) {
    logout(request)
  }
}

export const getUserInfo = async (request: Request) => {
  const session = await getUserSession(request)

  const userId = session.get('userId')
  const username = session.get('name')
  const profilePicture = session.get('profilePicture')

  if (
    typeof userId === 'string' &&
    typeof username === 'string' &&
    typeof profilePicture === 'string'
  ) {
    return {
      userId,
      username,
      profilePicture,
    }
  }

  return {
    userId: null,
    username: null,
    profilePicture: null,
  }
}
