import { ActionFunction } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'
import { Input, Label } from '~/components/form-elements'
import { login } from '~/utils/auth.server'
import { loginFormSchema } from '~/utils/form-valiation-schema'

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const { email, password } = Object.fromEntries(formData)

  try {
    loginFormSchema.parse({
      email,
      password,
    })
    const user = {
      email: email.toString(),
      password: password.toString(),
    }
    const res = await login(user)
    return {
      ...res,
    }
  } catch (error) {
    return {
      ...Object.fromEntries(formData),
      error,
    }
  }
}

const checkValidation = (key: string, data: any) => {
  let hasError = false
  data?.error?.issues.forEach((issue: any) => {
    if (issue.path[0] === key) {
      hasError = true
    }
  })

  return hasError
}

const Login = () => {
  const actionData = useActionData()
  return (
    <div className='md:flex md:items-center'>
      <div className='md:w-1/2 p-10'>
        <img src='/images/login.png' alt='login' className='p-10' />
      </div>
      <div className='md:w-1/2 p-10'>
        <h1 className='text-3xl font-bold my-6'>Login</h1>
        {actionData?.message && (
          <div role='alert'>
            <p className='text-red-600'>{actionData?.message}</p>
          </div>
        )}
        <Form method='post'>
          <div className='mb-2'>
            <Label htmlFor='email'>Enter Email</Label>
            <Input
              type='email'
              name='email'
              id='email'
              placeholder='Enter Email'
              className={
                checkValidation('email', actionData) ? 'bg-red-50 ring-2 ring-red-400' : ''
              }
            />
            <span className='text-sm text-red-500'>
              {checkValidation('email', actionData) ? 'Invalid email' : ''}
            </span>
          </div>
          <div className='mb-2'>
            <Label htmlFor='password'>Enter Password</Label>
            <Input
              type='password'
              name='password'
              id='password'
              placeholder='Enter password'
              className={
                checkValidation('password', actionData) ? 'bg-red-50 ring-2 ring-red-400' : ''
              }
            />
            <span className='text-sm text-red-500'>
              {checkValidation('password', actionData)
                ? 'Password must be 8 character or more'
                : ''}
            </span>
          </div>
          <div className='mb-2'>
            <button type='submit' className='px-6 py-3 rounded-md bg-sky-600 text-white'>
              Login
            </button>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default Login
