import { ActionFunction, HeadersFunction, LinksFunction } from '@remix-run/node'
import { Form, Link, useActionData, useTransition } from '@remix-run/react'
import * as React from 'react'
import { Input, Label } from '~/components/form-elements'
import { Spinner } from '~/components/icons/spinner'
import { sendRegisterAccountLink } from '~/utils/auth.server'

import modalStyles from '@reach/dialog/styles.css'
import SuccessModal from '~/components/success-modal'

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
    <div className='grid grid-cols-2 items-center gap-12 h-screen'>
      <div className='hidden lg:block md:col-span-1'>
        <img src='/images/login.png' alt='register' className='p-20' />
      </div>
      <div className='col-span-2 lg:col-span-1 p-4 md:p-20 bg-white rounded-xl mx-2 py-10 md:mx-20 lg:mx-8'>
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
            className='px-16 py-3 w-full rounded-lg bg-blue-600 text-white inline-block mt-6 text-center text-sm -tracking-tighter font-medium shadow-lg shadow-blue-500/30 hover:bg-blue-700 border-2 border-blue-600 hover:border-blue-700'
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
            <Link prefetch='intent' className='text-blue-600' to='/auth/login'>
              Login Here
            </Link>
          </p>
        </div>
      </div>
      {actionData?.status === 200 && (
        <SuccessModal
          email={actionData?.email}
          showDialog={showDialog}
          setShowDialog={setShowDialog}
        />
      )}
    </div>
  )
}

export default registerLink
