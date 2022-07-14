import { json, LoaderFunction, MetaFunction, redirect } from '@remix-run/node'
import { Form, useActionData, useLoaderData, useTransition } from '@remix-run/react'
import { Label } from '~/components/form-elements'
import { Spinner } from '~/components/icons/spinner'
import { NotificationMessage } from '~/components/notification-message'
import { H4 } from '~/components/typography'
import { getUserInfoFromDB, updateUsername } from '~/utils/auth.server'
import { createUserSession, getUserId } from '~/utils/session.server'

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request)
  if (!userId) {
    return redirect('/auth/login')
  }
  const user = await getUserInfoFromDB(userId as string)
  return json({ ...user, env: process.env.IMAGE_BB_KEY })
}

export const action: LoaderFunction = async ({ request }) => {
  const formData = await request.formData()
  const { username, email } = Object.fromEntries(formData)

  if (username.toString().length < 2) {
    return {
      status: 500,
      errorFor: 'username',
      message: 'Username can not be less than 2 character.',
    }
  }

  const res = await updateUsername(email as string, username as string)
  if (res.status === 200) {
    return await createUserSession(
      res.user?.name as string,
      res.user?.id as string,
      res?.user?.profilePicture as string,
      res?.user?.username as string,
      res?.user?.role as string,
      '/setting',
    )
  }

  return json(res)
}

export const meta: MetaFunction = () => {
  return {
    title: 'Setting - Binary Coders',
    description: 'Customize to make your public profile more attractive',
  }
}

const Me = () => {
  const { username, email } = useLoaderData()

  const transition = useTransition()
  const actionData = useActionData()
  return (
    <div>
      <H4>Update your account</H4>
      <div className='p-4'>
        <Form method='post' className='space-y-6'>
          <div className='my-2'>
            <Label htmlFor='name'>Username</Label>
            <input
              className='w-full py-1 bg-inherit border-b border-slate-200 focus:outline-none text-slate-400'
              name='username'
              placeholder='Enter name'
              defaultValue={username}
            />
            {actionData?.errorFor === 'username' && (
              <small className='text-red-500'>{actionData?.message}</small>
            )}
            {actionData?.status === 401 && (
              <small className='text-red-500'>{actionData?.message}</small>
            )}
          </div>
          <div className='my-2'>
            <label className='text-sm mb-1 font-medium' htmlFor='email'>
              Email Address (Email address can&apos;t be changed)
            </label>
            <input
              name='email'
              placeholder='Enter Email'
              type='email'
              defaultValue={email}
              value={email}
              onChange={() => console.log()}
              className='w-full py-1 bg-inherit border-b border-slate-200 focus:outline-none text-slate-400'
            />
          </div>
          <div className='flex justify-end'>
            <button
              type='submit'
              name='action'
              value='info'
              className='px-8 sm:px-12 inline-block my-4 py-2 sm:py-3  bg-blue-500 text-white rounded-lg text-sm font-medium shadow-lg hover:bg-blue-600 transition duration-200 shadow-blue-500/50'
            >
              {transition.submission?.method === 'POST' && transition.submission ? (
                <div className='flex justify-center items-center'>
                  <Spinner />
                  {transition.state}
                </div>
              ) : (
                'Save changes'
              )}
            </button>
          </div>
        </Form>
      </div>
      {actionData?.status === 200 && (
        <NotificationMessage>
          <p>Username updated successful</p>
        </NotificationMessage>
      )}
    </div>
  )
}

export default Me

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
