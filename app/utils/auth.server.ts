import { json } from '@remix-run/node'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from './prisma.server'
import type { Login, Register } from './types.server'
import { createUser } from './user.server'

export async function register(user: Register) {
  const exists = await prisma.user.count({ where: { email: user.email } })

  if (exists) {
    return { message: 'User already exists with that email', status: 400 }
  }
  const res = await createUser(user)
  return res
}

export const login = async (user: Login) => {
  const findUser = await prisma.user.findUnique({
    where: { email: user.email },
  })

  if (!findUser) {
    return { message: 'Wring credential', status: 400 }
  }

  const checkPassword = await bcrypt.compare(user.password, findUser.password)

  if (!checkPassword) {
    return { message: 'Wring credential', status: 400 }
  }

  return { message: 'login successful', status: 200 }
}

type Token = {
  id: string
  expiresIn: string
  idt: number
}

export const verifiedUser = async (token: string) => {
  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET as string)
    const user = await prisma.user.findUnique({
      where: {
        id: (decoded as Token).id,
      },
    })
    if (user) {
      const tokenValid = token === user.verifiedToken

      if (tokenValid) {
        await prisma.user.update({
          where: {
            email: user.email,
          },
          data: {
            verifiedToken: '',
            isVerified: true,
          },
        })
        return json({ message: 'Account activation complete' })
      } else {
        return json({ message: 'Invalid token' })
      }
    } else {
      return json({ message: 'Invalid token' })
    }
  } catch (error) {
    return json({ message: 'invalid token' })
  }
}
