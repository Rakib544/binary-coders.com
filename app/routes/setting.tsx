import { Link, Outlet, useLocation } from '@remix-run/react'
import { H2, Paragraph } from '~/components/typography'

const Profile = () => {
  const location = useLocation()
  return (
    <>
      <div className='text-center py-16 bg-slate-600'>
        <H2 className='text-white'>Account setting</H2>
        <Paragraph className='text-white'>Need to tweak a setting</Paragraph>
      </div>
      <div className='grid grid-cols-10 py-4 mx-20 shadow-md mb-20 rounded-md'>
        <aside className='col-span-2 py-10 px-4 border-r border-slate-300 flex justify-center'>
          <div className='w-full'>
            <Link
              to='/setting'
              className={`block px-4 py-3 bg-gray-200 font-medium my-2 text-sm rounded-xl hover:ring-1 hover:ring-blue-500 hover:text-blue-500 transition duration-300 ${
                location.pathname === '/setting' ? 'ring-1 ring-blue-500 text-blue-500' : ''
              }`}
            >
              Account
            </Link>
            <Link
              to='profile'
              className={`block px-4 py-3 bg-gray-200 font-medium my-2 text-sm rounded-xl hover:ring-1 hover:ring-blue-500 hover:text-blue-500 transition duration-300 ${
                location.pathname === '/setting/profile' ? 'ring-1 ring-blue-500 text-blue-500' : ''
              }`}
            >
              Profile
            </Link>
            <Link
              to='password'
              className={`block px-4 py-3 bg-gray-200 font-medium text-sm my-2 rounded-xl hover:ring-1 hover:ring-blue-500 hover:text-blue-500 transition duration-300 ${
                location.pathname === '/setting/password'
                  ? 'ring-1 ring-blue-500 text-blue-500'
                  : ''
              }`}
            >
              Password
            </Link>
          </div>
        </aside>
        <div className='col-span-8 p-4'>
          <Outlet />
        </div>
      </div>
    </>
  )
}

export default Profile
