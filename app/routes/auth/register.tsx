/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActionFunction, json, LinksFunction, LoaderFunction, redirect } from '@remix-run/node'
import { Form, Link, useActionData, useLoaderData, useTransition } from '@remix-run/react'
import * as React from 'react'
import { Input, Label } from '~/components/form-elements'
import SuccessModal from '~/components/success-modal'
import { register } from '~/utils/auth.server'
import { registerFormSchema } from '~/utils/form-valiation-schema'

import modalStyles from '@reach/dialog/styles.css'
import { Spinner } from '~/components/icons/spinner'
import { getUserInfo } from '~/utils/session.server'

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: modalStyles }]
}

export const action: ActionFunction = async ({ request }) => {
  const values = await request.formData()
  const { name, email, password, gender, profile } = Object.fromEntries(values)

  try {
    registerFormSchema.parse({
      name: name,
      email: email,
      password: password,
      gender: gender,
      profilePicture: profile,
    })

    const user = {
      name: name.toString(),
      email: email.toString(),
      password: password.toString(),
      gender: gender.toString(),
      profilePicture: profile.toString(),
    }

    const res = await register(user)
    return {
      ...res,
    }
  } catch (error) {
    return {
      ...Object.fromEntries(values),
      error,
    }
  }
}

export const loader: LoaderFunction = async ({ request }) => {
  const res = await getUserInfo(request)
  if (res.userId !== null) {
    return redirect('/')
  }
  return json({ env: process.env.IMAGE_BB_KEY })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const checkValidation = (key: string, data: any) => {
  let hasError = false
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?.error?.issues?.forEach((issue: any) => {
    if (issue.path[0] === key) {
      hasError = true
    }
  })

  return hasError
}

const Register = () => {
  const { env } = useLoaderData()
  const actionData = useActionData()
  const transition = useTransition()

  const [img, setImg] = React.useState<string>('')
  const [imgUploading, setImgUploading] = React.useState<boolean>(false)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleImageUpload = async (e: any) => {
    setImgUploading(true)
    const imageData = new FormData()
    imageData.set('key', env)
    imageData.append('image', e.target.files[0])
    const res = await window.fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: imageData,
    })
    const data = await res.json()
    setImg(data.data.url)
    setImgUploading(false)
  }
  return (
    <div className='sm:flex sm:items-center h-auto '>
      <div className='hidden lg:block sm:w-1/2 p-10'>
        <img src='/images/login.png' alt='img' className='md:p-10' />
      </div>
      <div className='w-full mx-auto sm:w-2/3 lg:w-1/2 px-4 sm:px-8 md:px-12 lg:px-24 my-16'>
        <div className='block lg:hidden'>
          <img
            src='/images/login-mobile.webp'
            alt='login'
            className='h-48 object-cover object-center block mx-auto'
          />
        </div>
        <h1 className='text-3xl font-bold text-center md:text-left'>Let&apos;s Get Started!</h1>
        <p className='mb-8 text-center md:text-left'>
          Create an account to Binary Coders to get all features
        </p>
        <div>
          <input
            type='file'
            onChange={handleImageUpload}
            className='block my-4 w-full text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-violet-50 file:text-violet-700
      hover:file:bg-violet-100'
          />
        </div>
        <span className='text-sm text-red-500'>
          {actionData?.error?.issues?.map((issue: any) =>
            issue.path[0] === 'profilePicture' ? 'Please upload a photo' : '',
          )}
        </span>
        {imgUploading ? 'Image uploading.... Please wait' : ''}
        {actionData?.message && (
          <div role='alert'>
            <p className={`${actionData?.status === 400 ? 'text-red-500 my-4' : 'text-green-600'}`}>
              {actionData?.message}
            </p>
          </div>
        )}
        <Form method='post'>
          <div className='mb-2'>
            <Label htmlFor='name'>Name</Label>
            <Input
              name='name'
              type='text'
              placeholder='Enter Name'
              className={
                checkValidation('name', actionData) ? 'ring-red-500 placeholder:text-red-500' : ''
              }
            />
            <span className='text-sm text-red-500'>
              {checkValidation('name', actionData) ? 'Name must be 3 character or more' : ''}
            </span>
          </div>
          <div className='mb-2'>
            <Label htmlFor='email'>Email</Label>
            <Input
              type='email'
              name='email'
              id='email'
              placeholder='Enter email'
              className={
                checkValidation('email', actionData) ? 'ring-red-500 placeholder:text-red-500' : ''
              }
            />
            <span className='text-sm text-red-500'>
              {checkValidation('email', actionData) ? 'Invalid Email' : ''}
            </span>
          </div>
          <div className='mb-2'>
            <Label htmlFor='password'>Password</Label>
            <Input
              type='password'
              name='password'
              id='password'
              placeholder='Enter Password'
              className={
                checkValidation('password', actionData)
                  ? 'ring-red-500 placeholder:text-red-500'
                  : ''
              }
            />
            <span className='text-sm text-red-500'>
              {checkValidation('password', actionData)
                ? 'Password Must be 8 character or more'
                : ''}
            </span>
          </div>
          <span className='text-sm text-red-500'>
            {checkValidation('gender', actionData) ? 'Please select a gender' : ''}
          </span>
          <Label htmlFor='' className='mt-2'>
            Gender
          </Label>
          <div className='text-md mb-2 flex items-center'>
            <label htmlFor='male' className='cursor-pointer block mr-4'>
              {' '}
              <input type='radio' name='gender' value='male' id='male' /> Male
            </label>
            <label htmlFor='female' className='cursor-pointer block mr-4'>
              <input type='radio' name='gender' value='female' id='female' /> Female
            </label>
            <label htmlFor='others' className='cursor-pointer block mr-4'>
              {' '}
              <input type='radio' name='gender' value='others' id='others' /> Others
            </label>
          </div>
          <div>
            <input
              type='text'
              name='profile'
              className='hidden'
              value={img}
              onChange={() => {
                console.log('hello')
              }}
            />
          </div>
          <Link className='text-blue-600 underline' to='/auth/reset'>
            Reset Password
          </Link>
          <button
            className='px-6 py-3 rounded-full bg-blue-600 text-white block w-full mt-4'
            type='submit'
          >
            {transition.submission ? (
              <div className='flex justify-center items-center'>
                <Spinner />
                {transition.state}
              </div>
            ) : (
              'Register'
            )}
          </button>

          <div>
            <p className='text-sm font-medium mt-4'>
              Not Registered yet?{' '}
              <Link className='text-blue-600' to='/auth/login'>
                Login Here
              </Link>
            </p>
          </div>
        </Form>
      </div>
      <SuccessModal email={actionData?.email ? actionData?.email : ''} />
    </div>
  )
}

export default Register
