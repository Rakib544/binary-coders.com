import bcrypt from 'bcryptjs'
import { prisma } from './prisma.server'
import { Register } from './types.server'

export const createUser = async (user: Register) => {
  try {
    const passwordHash = await bcrypt.hash(user.password, 10)
    const username = `${user.name.split(' ').join('-').toLowerCase()}-${new Date().getTime()}`

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

type User = {
  id: string
  name: string
  email: string
  bio: string
  location: string
}

export const getUserInfoByUsername = async (username: string) => {
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      name: true,
      email: true,
      profilePicture: true,
      bio: true,
      location: true,
    },
  })

  const blogs = await prisma.blogPosts.findMany({ where: { authorId: (user as User).id } })
  const questions = await prisma.question.findMany({ where: { authorId: (user as User).id } })

  return {
    user,
    blogs,
    questions,
  }
}
