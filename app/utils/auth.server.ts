import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { sendMail } from './mail-server'
import { prisma } from './prisma.server'
import type { Login, Register } from './types.server'
import { createUser } from './user.server'

export async function register(user: Register) {
  try {
    const exists = await prisma.user.count({ where: { email: user.email } })

    if (exists) {
      return { message: 'User already exists with that email', status: 400 }
    }
    const res = await createUser(user)
    return res
  } catch (error) {
    throw new Error('Something went wrong. Please try again')
  }
}

export const login = async (user: Login) => {
  try {
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
        name: findUser.name,
        id: findUser.id,
        profilePicture: findUser.profilePicture,
        username: findUser.username,
        role: findUser.role,
      },
      message: 'login successful',
      status: 200,
    }
  } catch (error) {
    throw new Error('Something went wrong. Please try again.')
  }
}

type Token = {
  id?: string
  email?: string
  expiresIn: string
  idt: number
}

// export const verifiedUser = async (token: string) => {
//   try {
//     const decoded = await jwt.verify(token, process.env.JWT_SECRET as string)

//     const user = await prisma.user.findUnique({
//       where: {
//         email: (decoded as Token).email,
//       },
//     })
//     if (user) {
//       const tokenValid = token === user.verifiedToken
//       console.log(tokenValid)
//       if (tokenValid) {
//         await prisma.user.update({
//           where: {
//             email: user.email,
//           },
//           data: {
//             verifiedToken: '',
//             isVerified: true,
//           },
//         })
//         return { message: 'Account activation complete', status: 201 }
//       } else {
//         return { message: 'Invalid token', status: 401 }
//       }
//     } else {
//       return { message: 'Invalid token', status: 401 }
//     }
//   } catch (error) {
//     return { message: 'Invalid token', status: 401 }
//   }
// }

export const checkRegisterLinkToken = async (token: string) => {
  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET as string)
    const user = await prisma.user.findUnique({ where: { email: (decoded as Token).email } })
    if (user) {
      return {
        status: 401,
        message: 'Invalid token',
      }
    }

    return {
      status: 200,
      email: (decoded as Token).email,
    }
  } catch (error) {
    return {
      status: 401,
      message: 'Invalid token',
    }
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

    // await sendAEmail({
    //   to: user.email,
    //   subject: 'Reset password token',
    //   token,
    //   reset: true,
    // })

    await sendMail(user.email, 'Reset Password Token', token, true)

    return {
      status: 200,
      message: 'Reset token sent successful',
      email: user.email,
    }
  } catch (error) {
    throw new Error('Something went wrong. Please try again.')
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
    throw new Error('Something went wrong. Please try again.')
  }
}

export const getUserInfoFromDB = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        email: true,
        name: true,
        bio: true,
        username: true,
        websiteLink: true,
        githubLink: true,
        location: true,
        institute: true,
        profilePicture: true,
      },
    })

    return user
  } catch (error) {
    throw new Error('Something went wrong. Please try again')
  }
}

export const updateUserInfo = async (
  email: string,
  name: string,
  profilePicture: string,
  location: string,
  institute: string,
  websiteLink: string,
  githubLink: string,
  bio: string,
) => {
  try {
    const user = await prisma.user.update({
      where: {
        email,
      },
      data: {
        name,
        profilePicture,
        location,
        institute,
        websiteLink: websiteLink,
        githubLink,
        bio,
      },
      select: {
        name: true,
        id: true,
        profilePicture: true,
        username: true,
        role: true,
      },
    })

    return {
      status: 200,
      user: user,
      message: 'Profile Updated successful',
    }
  } catch (error) {
    throw new Error('Something went wrong. Please try again.')
  }
}

export const updateUsername = async (email: string, username: string) => {
  try {
    const isUsernameExists = await prisma.user.findUnique({ where: { username } })

    if (isUsernameExists) {
      if (isUsernameExists.email === email) {
        return {
          status: 401,
          message:
            'This username is currently taken by your account. If you want to change your username try with another name',
        }
      }
      return {
        status: 401,
        message: 'Username already taken by another user.',
      }
    }

    const user = await prisma.user.update({
      where: {
        email,
      },
      data: {
        username: username,
      },
      select: {
        name: true,
        id: true,
        profilePicture: true,
        username: true,
        role: true,
      },
    })

    return {
      status: 200,
      user,
    }
  } catch (error) {
    throw new Error('Something went wrong. Please try again.')
  }
}

export const updateUserPassword = async (
  userId: string,
  password: string,
  newPassword: string,
  confirmPassword: string,
) => {
  try {
    const isPasswordMatched = newPassword === confirmPassword

    if (isPasswordMatched) {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      })

      if (user) {
        const isPasswordMatchedWithDBPassword = await bcrypt.compare(password, user.password)
        if (isPasswordMatchedWithDBPassword) {
          const hashPassword = await bcrypt.hash(newPassword, 10)
          await prisma.user.update({
            where: {
              email: user.email,
            },
            data: {
              password: hashPassword,
            },
          })
          return {
            status: 200,
            message: 'Password changed successfully',
          }
        } else {
          return {
            status: 500,
            name: 'password',
            message: 'Password is incorrect',
          }
        }
      }
    } else {
      return {
        status: 500,
        name: 'confirmPassword',
        message: 'New password and confirm password does not match.',
      }
    }
  } catch (error) {
    throw new Error('Something went wrong. Please try again.')
  }
}

export const sendRegisterAccountLink = async (email: string) => {
  try {
    const isUserExists = await prisma.user.findUnique({ where: { email } })

    if (isUserExists) {
      return {
        status: 500,
        message: 'User exists with this email',
      }
    }

    const token = jwt.sign(
      {
        email: email,
        expiresIn: '1d',
      },
      process.env.JWT_SECRET as string,
    )

    await sendMail(email, 'Register link', token, false)

    // await sendAEmail({
    //   to: email,
    //   subject: 'Account created',
    //   token,
    //   reset: false,
    // })

    // sendMail(email, token)
    return {
      status: 200,
      message: 'Register link sent successful',
      email: email,
    }
  } catch (error) {
    throw new Error('Something went wrong. Please try again.')
  }
}
