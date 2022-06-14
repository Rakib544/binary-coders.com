import { ActionFunction, LinksFunction, LoaderFunction, redirect } from '@remix-run/node'
import { Form, useActionData, useTransition } from '@remix-run/react'
import { Input, Label } from '~/components/form-elements'
import { Spinner } from '~/components/icons/spinner'
import SuccessModal from '~/components/success-modal'
import { resetToken } from '~/utils/auth.server'
import { restSchema } from '~/utils/form-valiation-schema'

import modalStyles from '@reach/dialog/styles.css'
import { getUserInfo } from '~/utils/session.server'

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: modalStyles }]
}

export const loader: LoaderFunction = async ({ request }) => {
  const res = await getUserInfo(request)

  if (res.userId !== null) {
    return redirect('/')
  }

  return null
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

const Reset = () => {
  const actionData = useActionData()
  const transition = useTransition()
  return (
    <div className='md:flex items-center'>
      <div className='hidden md:block md:w-1/2 p-10'>
        <img src='/images/reset.png' alt='reset-img' className='md:p-10' />
      </div>
      <div className='w-full md:w-1/2 px-2 md:px-24 my-16 md:my-0'>
        <h1 className='text-3xl font-bold my-4'>Are you forgot your password ?</h1>
        <p className='mb-4'>Don&apos;t worry about it. We have a solution. 😊</p>
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
          <button
            type='submit'
            className='px-6 py-3 rounded-full bg-blue-600 text-white block w-full mt-8 text-center'
          >
            {transition.submission ? (
              <div className='flex justify-center items-center'>
                <Spinner />
                {transition.state}
              </div>
            ) : (
              'Submit'
            )}
          </button>
        </Form>
      </div>
      <SuccessModal email={actionData?.email} />
    </div>
  )
}

export default Reset
