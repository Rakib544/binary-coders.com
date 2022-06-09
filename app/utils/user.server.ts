import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from './prisma.server'
import { Register } from './types.server'

export const createUser = async (user: Register) => {
  const passwordHash = await bcrypt.hash(user.password, 10)
  const newUser = await prisma.user.create({
    data: {
      name: user.name,
      email: user.email,
      password: passwordHash,
      gender: user.gender,
      profilePicture: user.profilePicture,
      verifiedToken: '',
      resetPasswordToken: '',
    },
  })

  const token = jwt.sign(
    {
      id: newUser.id,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    },
    'vjfknbfdvvjbfvjhdbvhbdjfhvbjh',
  )

  await prisma.user.update({
    where: {
      email: newUser.email,
    },
    data: {
      verifiedToken: token,
    },
  })
}
