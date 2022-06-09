import type { LoaderFunction } from '@remix-run/node'
import { verifiedUser } from '~/utils/auth.server'

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url)
  try {
    const { token } = Object.fromEntries(url.searchParams.entries())
    if (token) {
      const result = verifiedUser(token)
      console.log(result)
    }
  } catch (err) {
    console.log({ err })
  }

  return null
}

const Verify = () => {
  return <div>This is verify page</div>
}

export default Verify
