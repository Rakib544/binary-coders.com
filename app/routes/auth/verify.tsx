import { LoaderFunction, redirect } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { verifiedUser } from '~/utils/auth.server'
import { getUserInfo } from '~/utils/session.server'

export const loader: LoaderFunction = async ({ request }) => {
  const res = await getUserInfo(request)

  if (res.userId !== null) {
    return redirect('/')
  }

  const url = new URL(request.url)
  try {
    const { token } = Object.fromEntries(url.searchParams.entries())
    if (token) {
      const res = await verifiedUser(token)
      return {
        ...res,
      }
    } else {
      return {
        status: 404,
        message: 'No token found',
      }
    }
  } catch (err) {
    console.log({ err })
  }

  return null
}

const Verify = () => {
  const loaderData = useLoaderData()
  console.log(loaderData)
  return (
    <div className='flex justify-center items-center h-screen text-center'>
      <div>
        {/* <img src='https://i.ibb.co/KX9YN7Z/logo-01.png' alt='logo' className='h-14' /> */}
        <p className='text-2xl font-medium text-red-500'>
          {' '}
          {loaderData?.status === 404 && loaderData?.message}
        </p>
        {loaderData?.status === 401 && (
          <p className='text-2xl font-medium text-red-500'>{loaderData?.message}</p>
        )}

        {loaderData?.status === 201 && (
          <>
            <p className='text-2xl font-medium text-green-500'>{loaderData?.message}</p>
          </>
        )}
        <Link to='/' className='px-14 py-4 bg-blue-600 text-white inline-block rounded-full mt-16'>
          Back to home
        </Link>
      </div>
    </div>
  )
}

export default Verify
