import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { sendAEmail } from './email.server'
import { prisma } from './prisma.server'
import { Register } from './types.server'

export const createUser = async (user: Register) => {
  try {
    const passwordHash = await bcrypt.hash(user.password, 10)

    const token = jwt.sign(
      {
        email: user.email,
        expiresIn: '1d',
      },
      process.env.JWT_SECRET as string,
    )

    const result = await sendAEmail({
      to: user.email,
      subject: 'Account created',
      token,
      reset: false,
    })

    if (result[0].statusCode !== 202) {
      return {
        status: 403,
        message: 'Something went wrong. Please try again.',
      }
    }

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

    return {
      status: 201,
      message: 'Account created successfully',
      email: newUser.email,
    }
  } catch (error) {
    return { error: { message: 'Something went wrong. Please try again.' } }
  }
}
