import type { ActionFunction } from '@remix-run/node'
import { Form } from '@remix-run/react'
import * as React from 'react'
import { register } from '~/utils/auth.server'

export const action: ActionFunction = async ({ request }) => {
  const values = await request.formData()
  const { name, email, password, gender, profile } = Object.fromEntries(values)
  console.log({ name, email, password, profile })
  const user = {
    name: name.toString(),
    email: email.toString(),
    password: password.toString(),
    gender: gender.toString(),
    profilePicture: profile.toString(),
  }
  register(user)
  return null
}

const Register = () => {
  const [img, setImg] = React.useState<string>('')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleImageUpload = async (e: any) => {
    const imageData = new FormData()
    imageData.set('key', 'd17139582dad6f2a6f60bbc19e0dbd5e')
    imageData.append('image', e.target.files[0])
    const res = await window.fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: imageData,
    })
    const data = await res.json()
    setImg(data.data.url)
  }
  return (
    <div className='mx-12 flex'>
      <div className='w-1/2'>Image goes here</div>
      <div className='w-1/2'>
        <h1>Register</h1>
        <Form method='post'>
          <div>
            <label htmlFor='name'>Name</label>
            <input type='text' name='name' id='name' />
          </div>
          <div>
            <label htmlFor='email'>Email</label>
            <input
              type='email'
              name='email'
              id='email'
              className='px-2 py-2 bg-sky-100 border border-sky-600'
            />
          </div>
          <div>
            <label htmlFor='password'>Password</label>
            <input type='password' name='password' id='password' />
          </div>
          <div>
            <label htmlFor='male'>
              {' '}
              <input type='radio' name='gender' value='male' id='male' /> Male
            </label>
            <label htmlFor='female'>
              <input type='radio' name='gender' value='female' id='female' /> Female
            </label>
            <label htmlFor='others'>
              {' '}
              <input type='radio' name='gender' value='others' id='others' /> Others
            </label>
          </div>
          <div>
            <input
              type='text'
              name='profile'
              value={img}
              onChange={() => {
                console.log('hello')
              }}
            />
          </div>
          <button disabled={Boolean(img === '' ? true : false)} type='submit'>
            Register
          </button>
        </Form>
        <div>
          <input type='file' onChange={handleImageUpload} />
        </div>
      </div>
    </div>
  )
}

export default Register
