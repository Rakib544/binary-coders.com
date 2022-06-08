import { json } from '@remix-run/node'
import { prisma } from './prisma.server'
import type { Register } from './types.server'

export async function register(user: Register) {
  const exists = await prisma.user.count({ where: { email: user.email } })

  if (exists) {
    return json({ error: 'User already exists with that email' }, { status: 400 })
  }
}
