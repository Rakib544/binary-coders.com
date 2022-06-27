import { ActionFunction, LinksFunction } from '@remix-run/node'
import { Form, useActionData, useTransition } from '@remix-run/react'
import { Input, Label } from '~/components/form-elements'
import { Spinner } from '~/components/icons/spinner'
import SuccessModal from '~/components/success-modal'
import { sendRegisterAccountLink } from '~/utils/auth.server'

import modalStyles from '@reach/dialog/styles.css'

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: modalStyles }]
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const { email } = Object.fromEntries(formData)
  const res = await sendRegisterAccountLink(email as string)
  return { ...res }
}

const verify = () => {
  const actionData = useActionData()
  const transition = useTransition()
  return (
    <div className='flex justify-center items-center h-screen'>
      <div className='w-full p-4 md:w-1/2 mx-auto'>
        <Form method='post'>
          <Label htmlFor='email'>Enter Email</Label>
          <Input type='email' name='email' placeholder='Enter email' />
          <button
            className='px-16 py-3 rounded-full bg-blue-600 text-white inline-block mt-6 text-center text-sm -tracking-tighter font-medium shadow-lg shadow-blue-500/30 hover:bg-blue-700'
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
      </div>
      {actionData?.status === 200 && <SuccessModal email={actionData?.email} />}
    </div>
  )
}

export default verify
