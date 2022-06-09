import { json } from '@remix-run/node'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma.server'
import type { Login, Register } from './types.server'
import { createUser } from './user.server'

export async function register(user: Register) {
  const exists = await prisma.user.count({ where: { email: user.email } })

  if (exists) {
    return json({ error: 'User already exists with that email' }, { status: 400 })
  }

  createUser(user)

  // con
  // return { id: newUser.id, email: newUser.email }
}

export const login = async (user: Login) => {
  const findUser = await prisma.user.findUnique({
    where: { email: user.email },
  })

  if (!findUser) {
    return json({ message: 'Wring credential', status: 400 })
  }

  const checkPassword = await bcrypt.compare(user.password, findUser.password)

  if (!checkPassword) {
    return json({ message: 'Wring credential', status: 400 })
  }

  return json({ message: 'login successful' })
}
