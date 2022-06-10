import { ActionFunction, json, LoaderFunction } from '@remix-run/node'
import { Form, useActionData, useLoaderData } from '@remix-run/react'
import * as React from 'react'
import { Input, Label } from '~/components/form-elements'
import { register } from '~/utils/auth.server'
import { registerFormSchema } from '~/utils/form-valiation-schema'

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
    register(user)
  } catch (error) {
    return {
      ...Object.fromEntries(values),
      error,
    }
  }
  return {} as any
}

export const loader: LoaderFunction = async () => {
  return json({ env: process.env.IMAGE_BB_KEY })
}

const Register = () => {
  const { env } = useLoaderData()
  const actionData = useActionData()

  console.log(actionData)

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
    <div className='mx-12 flex'>
      <div className='w-1/2'>Image goes here</div>
      <div className='w-1/2'>
        <h1 className='text-3xl font-bold'>Register</h1>
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
        <Form method='post'>
          <div className='mb-2'>
            <Label htmlFor='name'>Enter Name</Label>
            <Input
              name='name'
              type='text'
              placeholder='Enter Name'
              defaultValue={actionData?.name}
              key={actionData?.name}
            />
            <span className='text-sm text-red-500'>
              {actionData?.error?.issues?.map((issue: any) =>
                issue.path[0] === 'name' ? 'Name must be 3 character or more' : '',
              )}
            </span>
          </div>
          <div className='mb-2'>
            <Label htmlFor='email'>Enter Email</Label>
            <Input
              type='email'
              name='email'
              id='email'
              placeholder='Enter email'
              defaultValue={actionData?.email}
              key={actionData?.email}
            />
            <span className='text-sm text-red-500'>
              {actionData?.error?.issues?.map((issue: any) =>
                issue.path[0] === 'email' ? 'Invalid Email' : '',
              )}
            </span>
          </div>
          <div className='mb-2'>
            <Label htmlFor='password'>Enter Password</Label>
            <Input
              type='password'
              name='password'
              id='password'
              placeholder='Enter Password'
              defaultValue={actionData?.password}
              key={actionData?.password}
            />
            <span className='text-sm text-red-500'>
              {actionData?.error?.issues?.map((issue: any) =>
                issue.path[0] === 'password' ? 'Password Must be 8 character or more' : '',
              )}
            </span>
          </div>
          <span className='text-sm text-red-500'>
            {actionData?.error?.issues?.map((issue: any) =>
              issue.path[0] === 'gender' ? 'Please select a gender' : '',
            )}
          </span>
          <div
            className='flex justify-between items-center text-md mb-2'
            defaultValue={actionData?.gender}
            key={actionData?.gender}
          >
            <label htmlFor='male' className='cursor-pointer'>
              {' '}
              <input type='radio' name='gender' value='male' id='male' /> Male
            </label>
            <label htmlFor='female' className='cursor-pointer'>
              <input type='radio' name='gender' value='female' id='female' /> Female
            </label>
            <label htmlFor='others' className='cursor-pointer'>
              {' '}
              <input type='radio' name='gender' value='others' id='others' /> Others
            </label>
          </div>
          <div>
            <input
              type='text'
              name='profile'
              className='hidden'
              defaultValue={actionData?.profile}
              key={actionData?.profile}
              value={img}
              onChange={() => {
                console.log('hello')
              }}
            />
          </div>
          <button
            className='inline-block px-6 py-2 rounded-md bg-sky-600 text-white cursor-pointer disabled:opacity-75'
            // disabled={Boolean(img === '' ? true : false)}
            type='submit'
          >
            Register
          </button>
        </Form>
      </div>
    </div>
  )
}

export default Register
