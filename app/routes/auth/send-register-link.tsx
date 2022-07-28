import { ActionFunction, HeadersFunction, LinksFunction, MetaFunction } from '@remix-run/node'
import { Form, Link, useActionData, useTransition } from '@remix-run/react'
import * as React from 'react'
import { Input, Label } from '~/components/form-elements'
import { Spinner } from '~/components/icons/spinner'
import { sendRegisterAccountLink } from '~/utils/auth.server'
import logoOfBinaryCoders from '../../assets/logo.webp'

import modalStyles from '@reach/dialog/styles.css'
import Modal from '~/components/modal'

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: modalStyles }]
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const { email } = Object.fromEntries(formData)
  const res = await sendRegisterAccountLink(email as string)
  return { ...res }
}

export const headers: HeadersFunction = () => {
  return {
    'Cache-control': 'public, s-maxage=60 slate-while-revalidate=2678400',
  }
}

export const meta: MetaFunction = () => {
  return {
    title: 'Binary Coders | SingUp',
    description: 'Sign Up to get out support to learn programming fundamentals',
  }
}

const registerLink = () => {
  const actionData = useActionData()
  const transition = useTransition()

  const [showDialog, setShowDialog] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (actionData?.status === 200) {
      setShowDialog(true)
    }
  }, [actionData])

  return (
    <>
      <Link to='/'>
        <img
          src={logoOfBinaryCoders}
          alt='Binary Coders'
          className='h-12 w-auto absolute mt-12 ml-12'
        />
      </Link>
      <div className='grid grid-cols-2 items-center gap-12 h-screen'>
        <div className='hidden lg:block md:col-span-1'>
          <img src='/images/loginV2.png' alt='register' className='p-20' />
        </div>
        <div className='col-span-2 lg:col-span-1 p-4 md:p-20 bg-white rounded-xl mx-2 py-10 md:mx-20 lg:mx-8  shadow-2xl shadow-blue-500/10'>
          <h1 className='text-3xl font-bold text-center md:text-left'>Let&apos;s Get Started!</h1>
          <p className='mb-4 text-center md:text-left'>
            Create an account to Binary Coders to get all features
          </p>
          {actionData?.status === 500 && (
            <div role='alert'>
              <p className='text-red-500'>{actionData?.message}</p>
            </div>
          )}
          <Form method='post'>
            <Label htmlFor='email'>Enter Email</Label>
            <Input type='email' name='email' placeholder='Enter email' required />
            <button
              className='px-16 py-3 w-full rounded-lg bg-blue-500 text-white inline-block mt-8 text-center text-sm font-medium shadow-lg shadow-blue-500/30 hover:bg-blue-600 border-2 border-blue-500 hover:border-blue-600 transition duration-300'
              type='submit'
            >
              {transition.submission ? (
                <div className='flex justify-center items-center'>
                  <Spinner />
                  {transition.state}
                </div>
              ) : (
                'Send register link'
              )}
            </button>
          </Form>
          <div>
            <p className='text-sm font-medium pt-8 text-center'>
              Already Registered?{' '}
              <Link prefetch='intent' className='text-sky-600' to='/auth/login'>
                Login Here
              </Link>
            </p>
          </div>
        </div>
        {actionData?.status === 200 && (
          <Modal open={showDialog} setOpen={setShowDialog}>
            <div className='bg-white p-8'>
              <div className='text-center'>
                <h2 className='text-3xl font-medium test-slate-700'>Verify your email</h2>
                <p className='my-4'>You will need to verify your email to complete registration</p>
                <img src='/images/login.webp' alt='img' className='h-32 block mx-auto' />
                <p className='my-4'>
                  An email has been sent to{' '}
                  <span className='text-blue-600'>{actionData?.email}</span> with a link to complete
                  your registration. If you have not received the email after a few minutes, please
                  check, promotions, social or the spam folder
                </p>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </>
  )
}

export default registerLink

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
