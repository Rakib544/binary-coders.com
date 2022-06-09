import { ActionFunction } from '@remix-run/node'
import { Form } from '@remix-run/react'
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
    <div>
      <Form method='post'>
        <div>
          <label htmlFor='email'>Email</label>
          <input type='email' name='email' id='email' />
        </div>
        <div>
          <label htmlFor='password'>Email</label>
          <input type='password' name='password' id='password' />
        </div>
        <div>
          <button type='submit'>Login</button>
        </div>
      </Form>
    </div>
  )
}

export default Login
