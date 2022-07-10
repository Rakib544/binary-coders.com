import { ActionFunction, LoaderFunction, redirect } from '@remix-run/node'
import { Form, Link, useActionData, useLoaderData, useTransition } from '@remix-run/react'
import { motion, useReducedMotion } from 'framer-motion'
import { Input, Label } from '~/components/form-elements'
import { Spinner } from '~/components/icons/spinner'
import { checkResetToken, updatePassword } from '~/utils/auth.server'
import { getUserInfo } from '~/utils/session.server'

export const loader: LoaderFunction = async ({ request }) => {
  const res = await getUserInfo(request)

  if (res.userId !== null) {
    return redirect('/')
  }
  const url = new URL(request.url)

  try {
    const { token } = Object.fromEntries(url.searchParams.entries())
    const res = await checkResetToken(token)
    return {
      ...res,
    }
  } catch (error) {
    return {
      status: 404,
      message: 'No token found',
    }
  }
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()

  try {
    const { token, password, confirmPassword } = Object.fromEntries(formData)
    if (password.toString() === confirmPassword.toString()) {
      const res = await updatePassword(password.toString(), token.toString())
      return {
        ...res,
      }
    }
  } catch (error) {
    return {
      error,
    }
  }
}

const ResetPassword = () => {
  const loaderData = useLoaderData()
  const transition = useTransition()
  const actionData = useActionData()

  const shouldReducedMotion = useReducedMotion()

  const childVariants = {
    initial: { opacity: 0, y: shouldReducedMotion ? 0 : 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <motion.div
      className='flex justify-center items-center h-screen'
      initial='initial'
      animate='visible'
      variants={{
        initial: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
      }}
    >
      <div className='w-full md:w-1/2'>
        {actionData?.status === 200 ? (
          <p>{actionData?.message}</p>
        ) : (
          <>
            {' '}
            <p className='text-2xl font-medium text-red-500'>
              {' '}
              {loaderData?.status === 404 && loaderData?.message}
            </p>
            {loaderData?.status === 401 && (
              <div className='text-center'>
                <h2 className='text-6xl font-medium text-red-600'>{loaderData?.message}</h2>
                <p>Your token has been invalid. Please try to send reset token again</p>
                <Link
                  to='/'
                  className='px-16 py-3 rounded-full bg-blue-600 text-white inline-block mt-6 text-center text-sm -tracking-tighter font-medium shadow-lg shadow-blue-500/30 hover:bg-blue-700'
                >
                  Back to Home
                </Link>
              </div>
            )}
          </>
        )}

        {loaderData?.status === 201 && (
          <motion.div
            variants={childVariants}
            className='bg-white p-4 md:p-10 mx-4 md:mx-10 rounded-xl'
          >
            <h1 className='text-3xl font-semibold text-slate-800 py-4'>Change your password</h1>
            {actionData?.status === 200 ? (
              ''
            ) : (
              <p className='text-2xl font-medium text-green-600'>{loaderData?.message}</p>
            )}
            <Form method='put'>
              <input
                type='text'
                name='token'
                value={loaderData?.token ? loaderData?.token : ''}
                className='hidden'
                onChange={() => {
                  console.log('hello')
                }}
              />
              <div>
                <Label htmlFor='password'>New Password</Label>
                <Input type='password' name='password' placeholder='Enter new Password' />
              </div>
              <div>
                <Label htmlFor='confirm_password'>Confirm Password</Label>
                <Input
                  type='password'
                  name='confirmPassword'
                  placeholder='Enter Confirm Password'
                />
              </div>
              <div className='flex justify-center'>
                <button
                  type='submit'
                  className='px-16 py-3 rounded-lg w-full bg-blue-600 text-white inline-block mt-6 text-center text-sm -tracking-tighter font-medium shadow-lg shadow-blue-500/30 hover:bg-blue-700 border-2 border-blue-600 hover:border-blue-700'
                >
                  {transition.submission ? (
                    <div className='flex justify-center items-center'>
                      <Spinner />
                      {transition.state}
                    </div>
                  ) : (
                    'Change Password'
                  )}
                </button>
              </div>
            </Form>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default ResetPassword
