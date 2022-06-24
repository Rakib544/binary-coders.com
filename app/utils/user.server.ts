import bcrypt from 'bcryptjs'
import { prisma } from './prisma.server'
import { Register } from './types.server'

export const createUser = async (user: Register) => {
  try {
    const passwordHash = await bcrypt.hash(user.password, 10)
    const username = `@${user.name.split(' ').join('-').toLowerCase()}-${new Date().getTime()}`

    const newUser = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        username: username,
        password: passwordHash,
        gender: user.gender,
        profilePicture: user.profilePicture,
        resetPasswordToken: '',
        websiteLink: '',
        location: '',
        institute: '',
        bio: '',
        githubLink: '',
      },
    })

    return {
      status: 201,
      message: 'Account created successfully',
      user: {
        name: newUser.name,
        id: newUser.id,
        profilePicture: newUser.profilePicture,
        username: newUser.username,
        role: newUser.role,
      },
    }
  } catch (error) {
    return {
      status: 500,
      message: 'Something went wrong. Please try again',
    }
  }
}
