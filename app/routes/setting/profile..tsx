import { json, LoaderFunction, MetaFunction, redirect } from '@remix-run/node'
import { Form, useActionData, useLoaderData, useTransition } from '@remix-run/react'
import * as React from 'react'
import { Label } from '~/components/form-elements'
import CameraIcon from '~/components/icons/camera'
import { Spinner } from '~/components/icons/spinner'
import { NotificationMessage } from '~/components/notification-message'
import { H4 } from '~/components/typography'
import { getUserInfoFromDB, updateUserInfo } from '~/utils/auth.server'
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
  const { name, email, profilePicture, location, institute, webSiteLink, githubLink, bio } =
    Object.fromEntries(formData)

  if (name.toString().length < 2) {
    return {
      status: 500,
      errorFor: 'name',
      message: 'Name can not be less than 2 character.',
    }
  }

  const res = await updateUserInfo(
    email as string,
    name as string,
    profilePicture as string,
    location as string,
    institute as string,
    webSiteLink as string,
    githubLink as string,
    bio as string,
  )

  if (res.status === 200) {
    return await createUserSession(
      res.user?.name as string,
      res.user?.id as string,
      res?.user?.profilePicture as string,
      res?.user?.username as string,
      res?.user?.role as string,
      '/setting/profile',
    )
  }

  return json(res)
}

export const meta: MetaFunction = () => {
  return {
    title: 'Profile - Binary Coders',
    description: 'Customize to make your public profile more attractive',
  }
}

const Me = () => {
  const { email, name, profilePicture, githubLink, websiteLink, bio, location, institute, env } =
    useLoaderData()
  const transition = useTransition()
  const actionData = useActionData()

  const [img, setImg] = React.useState<string>(profilePicture)
  const [imgUploading, setImgUploading] = React.useState<boolean>(false)
  const [showImageError, setImageError] = React.useState<boolean>(false)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleImageUpload = async (e: any) => {
    setImgUploading(true)

    if (e.target.files[0].size > 1048576) {
      setImgUploading(false)
      setImageError(true)
    }

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
    setImageError(false)
  }

  return (
    <div>
      <H4>Update your profile</H4>
      <div className='p-4'>
        <div className='flex justify-center'>
          <label htmlFor='profilePicture' className='cursor-pointer relative'>
            <div className='absolute bottom-6 z-40 p-2 rounded-full right-0  backdrop-blur-sm bg-sky-200/50 '>
              <CameraIcon />
            </div>
            <input
              type='file'
              name='picture'
              id='profilePicture'
              className='hidden'
              onChange={handleImageUpload}
            />
            <div className='bg-gradient-to-r from-cyan-500 to-blue-500  p-0.5 rounded-full inline-block my-4'>
              <div className='bg-white p-0.5 rounded-full'>
                <img
                  src={img}
                  alt={name}
                  className='h-32 w-32 rounded-full object-cover block object-center align-middle cursor-pointer z-30'
                />
              </div>
            </div>
          </label>
        </div>
        {imgUploading && <small className='block text-center'>Image uploading...Please wait</small>}
        {showImageError && (
          <small className='text-red-500 text-center block'>
            Please upload a image less than 1MB.
          </small>
        )}
        <Form method='post'>
          <input type='email' name='email' defaultValue={email} className='hidden' />
          <div className='my-4'>
            <Label htmlFor='name'>Full Name</Label>
            <input
              className='w-full py-1 bg-inherit border-b border-slate-200 focus:outline-none text-slate-500'
              name='name'
              placeholder='Enter name'
              defaultValue={name}
            />
            {actionData?.errorFor === 'name' && (
              <small className='text-red-500'>{actionData?.message}</small>
            )}
          </div>
          <div className='my-6'>
            <Label htmlFor='webSiteLink'>Website Link</Label>
            <input
              className='w-full py-1 bg-inherit border-b border-slate-200 focus:outline-none text-slate-500'
              name='webSiteLink'
              placeholder='Enter your site link'
              defaultValue={websiteLink}
            />
          </div>
          <div className='my-6'>
            <Label htmlFor='location'>Location</Label>
            <input
              className='w-full py-1 bg-inherit border-b border-slate-200 focus:outline-none text-slate-500'
              name='location'
              placeholder='Enter your location'
              defaultValue={location}
            />
          </div>
          <div className='my-6'>
            <Label htmlFor='institute'>Institute Name</Label>
            <input
              className='w-full py-1 bg-inherit border-b border-slate-200 focus:outline-none text-slate-500'
              name='institute'
              placeholder='Enter your institute name'
              defaultValue={institute}
            />
          </div>
          <div className='my-6'>
            <Label htmlFor='githubLink'>Github link</Label>
            <input
              className='w-full py-1 bg-inherit border-b border-slate-200 focus:outline-none text-slate-500'
              name='githubLink'
              placeholder='Enter your github link'
              defaultValue={githubLink}
            />
          </div>
          <div className='my-6'>
            <Label htmlFor='bio'>Bio</Label>
            <textarea
              className='w-full py-1 bg-inherit border-b border-slate-200 focus:outline-none text-slate-500'
              name='bio'
              placeholder='Enter your github link'
              defaultValue={bio}
            />
          </div>
          {/* img part */}
          <div>
            <input type='text' defaultValue={img} name='profilePicture' className='hidden' />
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
          <p>Profile updated successful</p>
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
