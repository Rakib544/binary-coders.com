import { ActionFunction, LoaderFunction, redirect } from '@remix-run/node'
import { Form, Link, useActionData, useTransition } from '@remix-run/react'
import { Input, Label } from '~/components/form-elements'
import { Spinner } from '~/components/icons/spinner'
import { login } from '~/utils/auth.server'
import { loginFormSchema } from '~/utils/form-valiation-schema'
import { createUserSession, getUserInfo } from '~/utils/session.server'

export const loader: LoaderFunction = async ({ request }) => {
  const res = await getUserInfo(request)
  if (res.userId !== null) {
    return redirect('/')
  }
  return null
}

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

    if (res?.status === 400) {
      return {
        ...res,
      }
    }
    return createUserSession(
      res.user?.username as string,
      res.user?.id as string,
      res?.user?.profilePicture as string,
      '/',
    )
  } catch (error) {
    return {
      ...Object.fromEntries(formData),
      error,
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const checkValidation = (key: string, data: any) => {
  let hasError = false
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?.error?.issues.forEach((issue: any) => {
    if (issue.path[0] === key) {
      hasError = true
    }
  })

  return hasError
}

const Login = () => {
  const actionData = useActionData()
  const transition = useTransition()
  return (
    <div className='sm:flex sm:items-center h-auto overflow-auto lg:h-screen lg:overflow-hidden'>
      <div className='hidden lg:block sm:w-1/2 p-10'>
        <img src='/images/login.png' alt='login' className='md:p-10' />
      </div>
      <div className='w-full mx-auto sm:w-2/3 lg:w-1/2 px-4 sm:px-8 md:px-12 lg:px-24 my-16'>
        <div className='block lg:hidden'>
          <img
            src='/images/login-mobile.webp'
            alt='login'
            className='h-48 object-cover object-center block mx-auto'
          />
        </div>
        <h1 className='text-3xl font-bold text-center md:text-left'>Welcome back!</h1>
        <p className='mb-8 text-center md:text-left'>
          Login into your existing account of Binary Coders
        </p>
        {actionData?.message && (
          <div role='alert'>
            <p className='text-red-600'>{actionData?.message}</p>
          </div>
        )}
        <Form method='post'>
          <div className='mb-4'>
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
          <div className='mb-4'>
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
          <Link className='text-blue-600 underline text-right block' to='/auth/reset'>
            Reset Password
          </Link>
          <div className='mb-2 flex justify-center'>
            <button
              type='submit'
              className='px-16 py-3 rounded-full bg-blue-600 text-white inline-block mt-8 text-center text-sm -tracking-tighter font-medium shadow-lg shadow-blue-500/30 hover:bg-blue-700'
            >
              {transition.submission ? (
                <div className='flex justify-center items-center'>
                  <Spinner />
                  {transition.state}
                </div>
              ) : (
                'LOGIN'
              )}
            </button>
          </div>
          <div>
            <p className='text-sm font-medium pt-8 text-center'>
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
