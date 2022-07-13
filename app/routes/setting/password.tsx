import { ActionFunction, json, LoaderFunction, MetaFunction, redirect } from '@remix-run/node'
import { Form, useActionData, useTransition } from '@remix-run/react'
import * as React from 'react'
import { Label } from '~/components/form-elements'
import { Spinner } from '~/components/icons/spinner'
import { NotificationMessage } from '~/components/notification-message'
import { H4 } from '~/components/typography'
import { updateUserPassword } from '~/utils/auth.server'
import { getUserId, getUserInfo } from '~/utils/session.server'

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request)
  if (!userId) {
    return redirect('/auth/login')
  }
  return null
}

export const action: ActionFunction = async ({ request }) => {
  const { userId } = await getUserInfo(request)
  const formData = await request.formData()
  const { password, newPassword, confirmPassword } = Object.fromEntries(formData)

  const res = await updateUserPassword(
    userId as string,
    password as string,
    newPassword as string,
    confirmPassword as string,
  )
  return json(res)
}

export const meta: MetaFunction = () => {
  return {
    title: 'Update Password - Binary Coders',
    description: 'Update your password',
  }
}

const password = () => {
  const transition = useTransition()
  const actionData = useActionData()

  const passwordFormRef = React.useRef<HTMLFormElement>(null)

  React.useEffect(() => {
    if (passwordFormRef.current !== null) {
      passwordFormRef.current.reset()
    }
  }, [transition.state])

  return (
    <div>
      <H4>Update your Password</H4>
      <Form method='put' ref={passwordFormRef}>
        <div className='mt-12 space-y-6'>
          <div>
            <Label htmlFor='password'>Current Password</Label>
            <input
              className='w-full py-1 bg-inherit border-b border-slate-200 focus:outline-none'
              type='password'
              name='password'
              placeholder='Enter password'
            />
            {actionData?.status === 500 && actionData?.name === 'password' && (
              <small className='text-red-500'>{actionData?.message}</small>
            )}
          </div>
          <div>
            <Label htmlFor='newPassword'>New Password</Label>
            <input
              className='w-full py-1 bg-inherit border-b border-slate-200 focus:outline-none'
              type='password'
              name='newPassword'
              placeholder='Enter new password'
            />
          </div>
          <div>
            <Label htmlFor='confirmPassword'>Confirm Password</Label>
            <input
              className='w-full py-1 bg-inherit border-b border-slate-200 focus:outline-none'
              type='password'
              name='confirmPassword'
              placeholder='Enter confirm password'
            />
            {actionData?.status === 500 && actionData?.name === 'confirmPassword' && (
              <small className='text-red-500'>{actionData?.message}</small>
            )}
          </div>
        </div>
        <div className='flex justify-end'>
          <button
            type='submit'
            name='action'
            value='updatePass'
            className='px-8 sm:px-12 inline-block my-4 py-2 sm:py-3  bg-blue-500 text-white rounded-lg font-medium text-sm shadow-lg hover:bg-blue-600 transition duration-200 shadow-blue-500/50'
          >
            {transition.submission ? (
              <div className='flex justify-center items-center'>
                <Spinner />
                {transition.state}
              </div>
            ) : (
              'Update Password'
            )}
          </button>
        </div>
      </Form>
      {actionData?.status === 200 && (
        <NotificationMessage>
          <p>Password updated successful</p>
        </NotificationMessage>
      )}
    </div>
  )
}

export default password

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
