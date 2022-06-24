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
  fullName: string,
  id: string,
  profilePicture: string,
  username: string,
  role: string,
  redirectTo: string,
) => {
  const session = await storage.getSession()
  session.set('userId', id)
  session.set('fullName', fullName)
  session.set('profilePicture', profilePicture)
  session.set('role', role)
  session.set('username', username)
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

  const fullName = session.get('fullName')

  if (!fullName || typeof fullName !== 'string') return null
  return fullName
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
        username: true,
        role: true,
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
  const fullName = session.get('fullName')
  const username = session.get('username')
  const profilePicture = session.get('profilePicture')
  const role = session.get('role')
  const isVerified = session.get('isVerified')

  if (
    typeof userId === 'string' &&
    typeof username === 'string' &&
    typeof profilePicture === 'string'
  ) {
    return {
      userId,
      fullName,
      username,
      profilePicture,
      role,
      isVerified,
    }
  }

  return {
    userId: null,
    fullName: null,
    username: null,
    profilePicture: null,
    role: null,
    isVerified: null,
  }
}
