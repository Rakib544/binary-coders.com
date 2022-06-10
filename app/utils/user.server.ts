import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { sendAccountVerifiedEmail } from './email.server'
import { prisma } from './prisma.server'
import { Register } from './types.server'

export const createUser = async (user: Register) => {
  try {
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
        expiresIn: '1d',
      },
      process.env.JWT_SECRET as string,
    )

    await prisma.user.update({
      where: {
        email: newUser.email,
      },
      data: {
        verifiedToken: token,
      },
    })

    await sendAccountVerifiedEmail({
      to: newUser.email,
      subject: 'Account created',
      token,
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
