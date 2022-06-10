import { ActionFunction } from '@remix-run/node'
import { Form, Link, useActionData } from '@remix-run/react'
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
      <div className='hidden md:block md:w-1/2 p-10'>
        <img src='/images/login.png' alt='login' className='md:p-10' />
      </div>
      <div className='w-full md:w-1/2 px-2 md:px-24 my-16 md:my-0'>
        <h1 className='text-3xl font-bold my-6'>Login</h1>
        {actionData?.message && (
          <div role='alert'>
            <p className='text-red-600'>{actionData?.message}</p>
          </div>
        )}
        <Form method='post'>
          <div className='mb-2'>
            <Label htmlFor='email'>Email</Label>
            <Input
              type='email'
              name='email'
              id='email'
              placeholder='mail@gmail.com'
              className={
                checkValidation('email', actionData) ? 'ring-red-500 placeholder:text-red-500' : ''
              }
            />
            <span className='text-sm text-red-500'>
              {checkValidation('email', actionData) ? 'Invalid email' : ''}
            </span>
          </div>
          <div className='mb-2'>
            <Label htmlFor='password'>Password</Label>
            <Input
              type='password'
              name='password'
              id='password'
              placeholder='Min 8 character'
              className={
                checkValidation('password', actionData)
                  ? 'ring-red-500 placeholder:text-red-500'
                  : ''
              }
            />
            <span className='text-sm text-red-500'>
              {checkValidation('password', actionData)
                ? 'Password must be 8 character or more'
                : ''}
            </span>
          </div>
          <div className='mb-2'>
            <button
              type='submit'
              className='px-6 py-3 rounded-full bg-blue-600 text-white block w-full mt-8'
            >
              Login
            </button>
          </div>
          <div>
            <p className='text-sm font-medium mt-4'>
              Not Registered yet?{' '}
              <Link className='text-blue-600' to='/auth/register'>
                Create An Account
              </Link>
            </p>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default Login
