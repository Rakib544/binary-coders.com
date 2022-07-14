/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ActionFunction,
  json,
  LinksFunction,
  LoaderFunction,
  MetaFunction,
  redirect,
} from '@remix-run/node'
import { Form, Link, useActionData, useLoaderData, useTransition } from '@remix-run/react'
import { motion, useReducedMotion } from 'framer-motion'
import * as React from 'react'
import { Input, Label } from '~/components/form-elements'
import { checkRegisterLinkToken, register } from '~/utils/auth.server'
import { registerFormSchema } from '~/utils/form-valiation-schema'

import modalStyles from '@reach/dialog/styles.css'
import CameraIcon from '~/components/icons/camera'
import { DarkSpinner, Spinner } from '~/components/icons/spinner'
import { H1, Paragraph } from '~/components/typography'
import { createUserSession, getUserInfo } from '~/utils/session.server'

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
      name: name.toString().trim(),
      email: email.toString().trim(),
      password: password.toString().trim(),
      gender: gender.toString(),
      profilePicture: profile.toString(),
    }

    const res = await register(user)

    if (res?.status === 400) {
      return {
        ...res,
      }
    }

    return createUserSession(
      res.user?.name as string,
      res.user?.id as string,
      res?.user?.profilePicture as string,
      res?.user?.username as string,
      res?.user?.role as string,
      '/',
    )
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

  const url = new URL(request.url)
  const { token } = Object.fromEntries(url.searchParams.entries())

  const result = await checkRegisterLinkToken(token as string)
  return json({ ...result, env: process.env.IMAGE_BB_KEY, token: token })
}

export const meta: MetaFunction = () => {
  return {
    title: 'Binary Coders | Register',
    description: 'Register to get out support to learn programming fundamentals',
  }
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
  const loaderData = useLoaderData()
  const actionData = useActionData()
  const transition = useTransition()

  const [img, setImg] = React.useState<string>('')
  const [imgUploading, setImgUploading] = React.useState<boolean>(false)
  const [showImageError, setImageError] = React.useState<boolean>(false)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleImageUpload = async (e: any) => {
    setImgUploading(true)
    // const img = new Image()
    // img.src = window.URL.createObjectURL(e.target.files[0])
    if (e.target.files[0].size > 1048576) {
      setImgUploading(false)
      setImageError(true)
    }
    // this is for getting image height and width
    // img.onload = () => {
    //   console.log(img.height, img.width)
    // }

    const imageData = new FormData()
    imageData.set('key', loaderData.env)
    imageData.append('image', e.target.files[0])
    const res = await window.fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: imageData,
    })
    const data = await res.json()
    setImg(data.data.url)
    setImgUploading(false)
    setImageError(false)
  }

  // framer motion code
  const shouldReducedMotion = useReducedMotion()
  const childVariants = {
    initial: { opacity: 0, y: shouldReducedMotion ? 0 : 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  if (loaderData.status === 401) {
    return (
      <div className='h-screen flex justify-center items-center'>
        <div className='text-center w-full p-4 md:w-1/2 mx-auto'>
          <H1 className='text-red-500'>{loaderData?.message}</H1>
          <Paragraph>
            <Paragraph>No token found in the url or just the token has been expired.</Paragraph>
          </Paragraph>
          <Paragraph>
            Back to the{' '}
            <Link prefetch='intent' to='/auth/send-registration-link' className='text-blue-500'>
              Send Registration Link
            </Link>{' '}
            to send registration link via Email and then complete your registration.
          </Paragraph>
          <Link
            prefetch='intent'
            to='/auth/send-register-link'
            className='px-16 py-3 rounded-full bg-blue-600 text-white inline-block mt-8 text-center text-sm -tracking-tighter font-medium shadow-lg shadow-blue-500/30 hover:bg-blue-700'
          >
            Back to send register page
          </Link>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className='sm:flex sm:items-center h-auto'
      initial='initial'
      animate='visible'
      variants={{
        initial: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
      }}
    >
      <div className='hidden lg:block sm:w-1/2 p-10'>
        <motion.img
          src='/images/login.webp'
          alt='img'
          className='md:p-10'
          initial={{ opacity: 0, scale: 1.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <motion.div
        className='w-full mx-auto sm:w-2/3 lg:w-1/2 px-4 sm:px-8 md:px-12 lg:px-24 md:my-16 bg-white py-10 rounded-xl lg:mx-8  shadow-2xl shadow-blue-500/10'
        variants={childVariants}
      >
        <div className='block lg:hidden'>
          <img
            src='/images/login-mobile.webp'
            alt='login'
            className='h-48 object-cover object-center block mx-auto'
          />
        </div>
        <h1 className='text-3xl font-bold text-center md:text-left'>Let&apos;s Get Started!</h1>
        <p className='mb-4 text-center md:text-left'>
          Create an account to Binary Coders to get all features
        </p>
        <div className='flex justify-center'>
          <label htmlFor='camera' className='relative cursor-pointer'>
            <input
              type='file'
              accept='image/*'
              onChange={handleImageUpload}
              id='camera'
              className='hidden'
            />
            <div className='w-32 h-32 bg-slate-50 flex flex-col items-center rounded-full justify-center border border-slate-400 border-dotted overflow-hidden'>
              <>
                {!img && (
                  <>
                    {imgUploading ? (
                      <>
                        <DarkSpinner />
                        <small>Uploading...</small>
                      </>
                    ) : (
                      <>
                        {' '}
                        <CameraIcon />
                        <small>Upload photo</small>
                      </>
                    )}
                  </>
                )}
              </>
              {img && <img src={img} alt='test' />}
            </div>
          </label>
        </div>
        <span className='text-sm text-red-500 block text-center'>
          {actionData?.error?.issues?.map((issue: any) =>
            issue.path[0] === 'profilePicture' ? 'Avatar is required' : '',
          )}
        </span>
        {showImageError && (
          <small className='text-red-500 text-center block'>
            Please upload a image less than 1MB.
          </small>
        )}
        {imgUploading ? 'Image uploading.... Please wait' : ''}
        {actionData?.message && (
          <div role='alert'>
            <p className={`${actionData?.status === 400 ? 'text-red-500 my-4' : 'text-green-600'}`}>
              {actionData?.message}
            </p>
          </div>
        )}
        <Form method='post' action={`/auth/register?token=${loaderData?.token}`}>
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
              value={loaderData?.email}
              onChange={() => console.log()}
              className={
                checkValidation('email', actionData)
                  ? 'ring-red-500 placeholder:text-red-500'
                  : 'bg-gray-100 focus:ring-1 focus:ring-slate-200 cursor-not-allowed'
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
          <div className='mb-2 flex justify-center'>
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
                'Register'
              )}
            </button>
          </div>

          <div>
            <p className='text-sm font-medium pt-8 text-center'>
              Already Registered?{' '}
              <Link prefetch='intent' className='text-blue-600' to='/auth/login'>
                Login Here
              </Link>
            </p>
          </div>
        </Form>
      </motion.div>
    </motion.div>
  )
}

export default Register

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
