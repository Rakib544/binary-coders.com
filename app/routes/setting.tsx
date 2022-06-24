import { LoaderFunction } from '@remix-run/node'
import { Link, Outlet, useLoaderData } from '@remix-run/react'
import { getUserInfo } from '~/utils/session.server'

export const loader: LoaderFunction = async ({ request }) => {
  const res = await getUserInfo(request)
  return {
    ...res,
  }
}

const Profile = () => {
  const loaderData = useLoaderData()
  // console.log(loaderData)
  return (
    <div className='grid grid-cols-10 px-12 py-4'>
      <aside className='col-span-2 shadow-lg py-10 rounded-md'>
        <img
          src={loaderData?.profilePicture}
          alt={loaderData?.fullName}
          className='w-20 h-20 rounded-full block mx-auto'
        />
        <p className='text-center my-4 text-lg font-medium'>{loaderData?.fullName}</p>
        <div>
          <Link to='/setting' className='block px-4 py-3 hover:bg-gray-200'>
            Profile
          </Link>
          <Link to='blogs' className='block px-4 py-3 hover:bg-gray-200'>
            Blogs
          </Link>
          <Link to='questions' className='block px-4 py-3 hover:bg-gray-200'>
            Questions
          </Link>
        </div>
      </aside>
      <div className='col-span-8 p-4'>
        <Outlet />
      </div>
    </div>
  )
}

export default Profile
