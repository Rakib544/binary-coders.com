import { json, LoaderFunction, redirect } from '@remix-run/node'
import { Form, useActionData, useLoaderData, useTransition } from '@remix-run/react'
import * as React from 'react'
import { Input, Label } from '~/components/form-elements'
import CameraIcon from '~/components/icons/camera'
import { Spinner } from '~/components/icons/spinner'
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
  const { name, email, profilePicture } = Object.fromEntries(formData)

  if (name.toString().length < 2) {
    return {
      status: 500,
      errorFor: 'name',
      message: 'Name can not be less than 2 character.',
    }
  }

  const res = await updateUserInfo(email as string, name as string, profilePicture as string)
  return await createUserSession(
    res.user?.name as string,
    res.user?.id as string,
    res?.user?.profilePicture as string,
    res?.user?.username as string,
    res?.user?.role as string,
    '/profile',
  )
}

const Me = () => {
  const { name, email, profilePicture, env } = useLoaderData()
  const transition = useTransition()
  const actionData = useActionData()

  const [img, setImg] = React.useState<string>(profilePicture)
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
    <div>
      <H4>Update your profile</H4>
      <div className='p-4'>
        <div className='flex justify-center'>
          <label htmlFor='profilePicture' className='cursor-pointer relative'>
            <div className='absolute bottom-6 z-50 p-2 rounded-full right-0  backdrop-blur-sm bg-sky-200/50 '>
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
                  className='h-32 w-32 rounded-full object-cover block object-center align-middle cursor-pointer z-40'
                />
              </div>
            </div>
            {imgUploading && <small>Image uploading...Please wait</small>}
          </label>
        </div>
        <Form method='post'>
          <div className='my-2'>
            <Label htmlFor='name'>Full Name</Label>
            <Input name='name' placeholder='Enter name' defaultValue={name} />
            {actionData?.errorFor === 'name' && (
              <small className='text-red-500'>{actionData?.message}</small>
            )}
          </div>
          <div>
            <input type='text' defaultValue={img} name='profilePicture' className='hidden' />
          </div>
          <div className='my-2'>
            <label className='text-sm mb-1 font-medium' htmlFor='email'>
              Email Address (Email address can&apos;t be changed)
            </label>
            <Input
              name='email'
              placeholder='Enter Email'
              type='email'
              defaultValue={email}
              value={email}
              onChange={() => console.log()}
              className='disabled:opacity-75 bg-white'
            />
          </div>
          <div className='flex justify-end'>
            <button
              type='submit'
              name='action'
              value='info'
              className='px-8 sm:px-12 inline-block my-4 py-2 sm:py-3  bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition duration-200 shadow-blue-500/50'
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
    </div>
  )
}

export default Me
