import {
  ActionFunction,
  HeadersFunction,
  json,
  LoaderFunction,
  MetaFunction,
  redirect,
} from '@remix-run/node'
import { Form, Link, useActionData, useTransition } from '@remix-run/react'
import { motion, useReducedMotion } from 'framer-motion'
import { Input, Label } from '~/components/form-elements'
import { Spinner } from '~/components/icons/spinner'
import { login } from '~/utils/auth.server'
import { loginFormSchema } from '~/utils/form-valiation-schema'
import { createUserSession, getUserInfo } from '~/utils/session.server'
import logoOfBinaryCoders from '../../assets/logo.webp'

export const loader: LoaderFunction = async ({ request }) => {
  const res = await getUserInfo(request)
  if (res.userId !== null) {
    return redirect('/')
  }
  return json(null)
}

export const headers: HeadersFunction = () => {
  return {
    'Cache-control': 'public, max-age=60 s-maxage=180 slate-while-revalidate=2678400',
  }
}

export const meta: MetaFunction = () => {
  return {
    title: 'Binary Coders | Login',
    description: 'Login to get out support to learn programming fundamentals',
  }
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
      email: email.toString().trim(),
      password: password.toString().trim(),
    }
    const res = await login(user)

    if (res?.status === 400) {
      return {
        ...res,
      }
    }

    return createUserSession(
      res.user?.name as string,
      res.user?.id as string,
      res?.user?.profilePicture as string,
      res?.user?.username as string,
      res?.user?.role as string,
      '/',
    )
  } catch (error) {
    return {
      ...Object.fromEntries(formData),
      error,
    }
  }
}

export function links() {
  return [
    {
      rel: 'preload',
      href: '/images/login.png',
      as: 'image',
    },
    {
      rel: 'preload',
      href: '/images/login-mobile.webp',
      as: 'image',
    },
  ]
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
  const shouldReducedMotion = useReducedMotion()

  const childVariants = {
    initial: { opacity: 0, y: shouldReducedMotion ? 0 : 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <>
      <Link to='/'>
        <img
          src={logoOfBinaryCoders}
          alt='Binary Coders'
          className='h-12 w-auto absolute mt-8 ml-12'
        />
      </Link>
      <motion.div
        className='sm:flex sm:items-center h-auto overflow-auto lg:h-screen lg:overflow-hidden bg-white md:bg-inherit'
        initial='initial'
        animate='visible'
        variants={{
          initial: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
        }}
      >
        <div className='hidden lg:block sm:w-1/2 p-10'>
          <motion.img
            src='/images/loginV2.png'
            alt='login'
            className='md:p-10'
            initial={{ opacity: 1, scale: 1.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
          />
        </div>
        <motion.div
          className='w-full mx-auto sm:w-2/3 lg:w-1/2 px-4 sm:px-8 md:px-12 lg:px-24 my-16 bg-white shadow-2xl shadow-blue-500/10 rounded-xl lg:mx-8 py-10'
          variants={childVariants}
        >
          <div className='block lg:hidden'>
            <img
              src='/images/login.png'
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
                  checkValidation('email', actionData)
                    ? 'ring-red-500 placeholder:text-red-500'
                    : ''
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
            <Link
              prefetch='intent'
              className='text-sky-500 underline text-right block'
              to='/auth/reset'
            >
              Reset Password
            </Link>
            <div className='mb-2 flex justify-center'>
              <button
                type='submit'
                className='px-16 py-3 w-full rounded-lg bg-blue-500 text-white inline-block mt-8 text-center text-sm font-medium shadow-lg shadow-blue-500/30 hover:bg-blue-600 border-2 border-blue-500 hover:border-blue-600 transition duration-300'
              >
                {transition.submission ? (
                  <div className='flex justify-center items-center'>
                    <Spinner />
                    {transition.state}
                  </div>
                ) : (
                  'Login'
                )}
              </button>
            </div>
            <div>
              <p className='text-sm font-medium pt-8 text-center'>
                Not Registered yet?{' '}
                <Link prefetch='intent' className='text-sky-500' to='/auth/send-register-link'>
                  Create An Account
                </Link>
              </p>
            </div>
          </Form>
        </motion.div>
      </motion.div>
    </>
  )
}

export default Login

export function ErrorBoundary() {
  return (
    <div className='justify-center flex'>
      <div className='text-center mb-20'>
        {' '}
        <img
          src='/images/connection-lost.webp'
          alt='connection-lost-img'
          className='h-40 block mx-auto'
        />
        <h1 className='text-3xl font-medium text-slate-700'>Ooops!</h1>
        <h2 className='text-xl font-medium text-slate-500'>
          It maybe happens due to your slow internet connection or{' '}
          <p>Something unexpected went wrong. Sorry about that.</p>
        </h2>
        <p className='text-slate-500'>Try to reload again</p>
        <button
          className='px-8 sm:px-12 py-2 sm:py-3  bg-blue-500 text-white rounded-lg text-sm font-medium shadow-lg hover:bg-blue-600 transition duration-200 shadow-blue-500/50 my-6'
          onClick={() => window.location.reload()}
        >
          Refresh
        </button>
      </div>
    </div>
  )
}
