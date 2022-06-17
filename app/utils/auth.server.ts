import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { sendAEmail } from './email.server'
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

  return {
    user: {
      username: findUser.name,
      id: findUser.id,
      profilePicture: findUser.profilePicture,
    },
    message: 'login successful',
    status: 200,
  }
}

type Token = {
  id?: string
  email?: string
  expiresIn: string
  idt: number
}

export const verifiedUser = async (token: string) => {
  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET as string)

    const user = await prisma.user.findUnique({
      where: {
        email: (decoded as Token).email,
      },
    })
    if (user) {
      const tokenValid = token === user.verifiedToken
      console.log(tokenValid)
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
        return { message: 'Account activation complete', status: 201 }
      } else {
        return { message: 'Invalid token', status: 401 }
      }
    } else {
      return { message: 'Invalid token', status: 401 }
    }
  } catch (error) {
    return { message: 'Invalid token', status: 401 }
  }
}

export const resetToken = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    })

    if (!user) {
      return {
        status: 404,
        message: 'No Account found with this email',
      }
    }

    const token = jwt.sign(
      {
        id: user.id,
        expiresIn: '1d',
      },
      process.env.JWT_SECRET as string,
    )

    await prisma.user.update({
      where: {
        email,
      },
      data: {
        resetPasswordToken: token,
      },
    })

    await sendAEmail({
      to: user.email,
      subject: 'Reset password token',
      token,
      reset: true,
    })

    return {
      status: 200,
      message: 'Reset token sent successful',
      email: user.email,
    }
  } catch (error) {
    return {
      status: 500,
      message: 'Something went wrong. Please try again',
    }
  }
}

export const checkResetToken = async (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string)

    const user = await prisma.user.findUnique({
      where: {
        id: (decoded as Token).id,
      },
    })

    if (!user) {
      return {
        status: 401,
        message: 'Invalid token',
      }
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: '',
      },
    })

    return {
      status: 201,
      message: 'Password reset successful',
      token: token,
    }
  } catch (error) {
    return {
      status: 401,
      message: 'Invalid token',
    }
  }
}

export const updatePassword = async (password: string, token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string)
    const passwordHash = await bcrypt.hash(password, 10)
    await prisma.user.update({
      where: {
        id: (decoded as Token).id,
      },
      data: {
        password: passwordHash,
        resetPasswordToken: '',
      },
    })

    return {
      status: 200,
      message: 'Password reset successful',
    }
  } catch (error) {
    return {
      status: 500,
      message: 'Something went wrong. Please try again.',
    }
  }
}
