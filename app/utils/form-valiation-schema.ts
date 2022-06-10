import { z } from 'zod'

export const registerFormSchema = z.object({
  name: z.string().min(3, { message: 'Name must be 3 or more characters long' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be 8 character or more long' }),
  gender: z.enum(['male', 'female', 'others']),
  profilePicture: z.string().url({ message: 'Invalid url' }),
})

export const loginFormSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be 8 character or more long' }),
})

export const restSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
})
