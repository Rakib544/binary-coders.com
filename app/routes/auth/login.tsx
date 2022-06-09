import { ActionFunction } from '@remix-run/node'
import { Form } from '@remix-run/react'
import { Input, Label } from '~/components/form-elements'
import { login } from '~/utils/auth.server'

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const { email, password } = Object.fromEntries(formData)

  const user = {
    email: email.toString(),
    password: password.toString(),
  }
  login(user)
  return null
}

const Login = () => {
  return (
    <div className='flex justify-center'>
      <div>
        <h1 className='text-3xl font-bold my-6'>Login</h1>
        <Form method='post'>
          <div className='mb-2'>
            <Label htmlFor='email'>Enter Email</Label>
            <Input type='email' name='email' id='email' placeholder='Enter Email' />
          </div>
          <div className='mb-2'>
            <Label htmlFor='password'>Enter Password</Label>
            <Input type='password' name='password' id='password' placeholder='Enter password' />
          </div>
          <div className='mb-2'>
            <button type='submit' className='px-6 py-3 rounded-md bg-sky-600 text-white'>
              Login
            </button>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default Login
