import {
  ActionFunction,
  HeadersFunction,
  json,
  LinksFunction,
  LoaderFunction,
  MetaFunction,
  redirect,
} from '@remix-run/node'
import { Form, Link, useActionData, useTransition } from '@remix-run/react'
import { motion, useReducedMotion } from 'framer-motion'
import * as React from 'react'
import { Input, Label } from '~/components/form-elements'
import { Spinner } from '~/components/icons/spinner'
import { resetToken } from '~/utils/auth.server'
import { restSchema } from '~/utils/form-valiation-schema'

import modalStyles from '@reach/dialog/styles.css'
import Modal from '~/components/modal'
import { getUserInfo } from '~/utils/session.server'

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: modalStyles }]
}

export const loader: LoaderFunction = async ({ request }) => {
  const res = await getUserInfo(request)

  if (res.userId !== null) {
    return redirect('/')
  }

  return json(null)
}

export const headers: HeadersFunction = () => {
  return {
    'Cache-control': 'public, s-maxage=60 slate-while-revalidate=2678400',
  }
}
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  try {
    const { email } = Object.fromEntries(formData)
    restSchema.parse({ email })
    const res = await resetToken(email.toString())
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

export const meta: MetaFunction = () => {
  return {
    title: 'Binary Coders | Reset Password',
    description: 'Reset your password to generate a new password',
  }
}

const Reset = () => {
  const actionData = useActionData()
  const transition = useTransition()

  const shouldReducedMotion = useReducedMotion()

  const [showDialog, setShowDialog] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (actionData?.status === 200) {
      setShowDialog(true)
    }
  }, [actionData])

  const childVariants = {
    initial: { opacity: 0, y: shouldReducedMotion ? 0 : 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <motion.div
      className='grid grid-cols-2 items-center md:h-screen'
      initial='initial'
      animate='visible'
      variants={{
        initial: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
      }}
    >
      <div className='hidden md:block col-span-2 sm:col-span-2 md:col-span-1 md:p-14'>
        <motion.img
          src='/images/reset-password.webp'
          alt='reset-img'
          initial={{ opacity: 0, scale: 1.3 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        />
      </div>
      <motion.div
        variants={childVariants}
        className='col-span-2 sm:col-span-2 md:col-span-1 px-6 mt-40 md:mt-0 md:px-14 bg-white py-10 mx-8 rounded-xl  shadow-2xl shadow-blue-500/10'
      >
        <h1 className='text-3xl font-bold text-center md:text-left'>
          Are you forgot your password ?
        </h1>
        <p className='mb-4 text-center md:text-left'>
          Don&apos;t worry about it. We have a solution. 😊
        </p>
        {actionData?.status === 404 && (
          <div role='alert'>
            <p className='text-red-600'>{actionData.message}</p>
          </div>
        )}
        <Form method='post'>
          <Label htmlFor='email'>Email</Label>
          <Input
            type='email'
            name='email'
            placeholder='mail@gmail.com'
            className={
              actionData?.error?.issues[0]?.message ? 'ring-red-500 placeholder:text-red-500' : ''
            }
          />
          <span className='text-sm text-red-500'>{actionData?.error?.issues[0]?.message}</span>
          <div className='flex justify-center'>
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
                'Send Request'
              )}
            </button>
          </div>
          <Link
            to='/auth/login'
            prefetch='intent'
            className='my-4 block text-center py-3 text-sm text-slate-700 rounded-xl font-semibold hover:bg-slate-50'
          >
            Back
          </Link>
        </Form>
      </motion.div>
      {actionData?.status === 200 && (
        <Modal open={showDialog} setOpen={setShowDialog}>
          <div className='bg-white p-8'>
            <div className='text-center'>
              <h2 className='text-3xl font-medium test-slate-700'>Reset your password</h2>
              <p className='my-4'>Check your mail to complete the reset password steps</p>
              <img src='/images/login.webp' alt='img' className='h-32 block mx-auto' />
              <p className='my-4'>
                An email has been sent to <span className='text-blue-600'>{actionData?.email}</span>{' '}
                with a link to reset your password. If you have not received the email after a few
                minutes, please check, promotions, social or the spam folder
              </p>
            </div>
          </div>
        </Modal>
      )}
    </motion.div>
  )
}

export default Reset

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
