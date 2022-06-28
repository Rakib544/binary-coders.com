import {
  ActionFunction,
  HeadersFunction,
  json,
  LinksFunction,
  LoaderFunction,
  redirect,
} from '@remix-run/node'
import { Form, useActionData, useTransition } from '@remix-run/react'
import { motion, useReducedMotion } from 'framer-motion'
import * as React from 'react'
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

  return json(null)
}

export const headers: HeadersFunction = () => {
  return {
    'Cache-control': `public, max-age=${60 * 10}, s-maxage=${60 * 60 * 24 * 30}`,
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
          src='/images/reset.png'
          alt='reset-img'
          initial={{ opacity: 0, scale: 1.3 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        />
      </div>
      <motion.div
        variants={childVariants}
        className='col-span-2 sm:col-span-2 md:col-span-1 px-6 mt-40 md:mt-0 md:px-14'
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
              className='px-16 py-3 rounded-full bg-blue-600 text-white inline-block mt-6 text-center text-sm -tracking-tighter font-medium shadow-lg shadow-blue-500/30 hover:bg-blue-700'
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
          </div>
        </Form>
      </motion.div>
      {actionData?.status === 200 && (
        <SuccessModal
          email={actionData?.email}
          showDialog={showDialog}
          setShowDialog={setShowDialog}
        />
      )}
    </motion.div>
  )
}

export default Reset
