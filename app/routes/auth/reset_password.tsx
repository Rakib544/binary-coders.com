import { ActionFunction, LoaderFunction, redirect } from '@remix-run/node'
import { Form, useActionData, useLoaderData, useTransition } from '@remix-run/react'
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

  return (
    <div className='flex justify-center items-center h-screen'>
      <div>
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
              <p className='text-2xl font-medium text-red-500'>{loaderData?.message}</p>
            )}
          </>
        )}

        {loaderData?.status === 201 && (
          <>
            {actionData?.status === 200 ? (
              ''
            ) : (
              <p className='text-2xl font-medium text-green-500'>{loaderData?.message}</p>
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
          </>
        )}
      </div>
    </div>
  )
}

export default ResetPassword
