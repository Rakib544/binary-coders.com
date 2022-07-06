import { Link, Outlet, useLocation } from '@remix-run/react'
import * as React from 'react'
import ArrowRightLines from '~/components/icons/arrow-right-lines'

const Profile = () => {
  const location = useLocation()
  const [show, setShow] = React.useState<boolean>(false)
  return (
    <div className='relative'>
      <div className='text-center py-16 bg-slate-700'>
        <h2 className='text-white font-4xl font-medium'>Account setting</h2>
        <p className='text-white'>Need to tweak a setting</p>
      </div>
      <div
        onClick={() => setShow(!show)}
        className='md:hidden h-10 w-10 bg-white rounded-full shadow-sm flex justify-center items-center border border-blue-500 absolute z-50 -left-4 top-80'
      >
        <ArrowRightLines />
      </div>
      <div
        className='grid grid-cols-10 py-4 md:mx-20 shadow-md mb-20 rounded-md relative transition duration-300'
        onClick={() => setShow(false)}
      >
        <aside className='hidden col-span-2 py-10 px-4 border-r border-slate-300 md:flex justify-center'>
          <div className='w-full'>
            <Link
              prefetch='intent'
              to='/setting'
              className={`block px-4 py-3 bg-gray-200 font-medium my-2 text-sm rounded-xl hover:ring-1 hover:ring-blue-500 hover:text-blue-500 transition duration-300 ${
                location.pathname === '/setting' ? 'ring-1 ring-blue-500 text-blue-500' : ''
              }`}
            >
              Account
            </Link>
            <Link
              prefetch='intent'
              to='profile'
              className={`block px-4 py-3 bg-gray-200 font-medium my-2 text-sm rounded-xl hover:ring-1 hover:ring-blue-500 hover:text-blue-500 transition duration-300 ${
                location.pathname === '/setting/profile' ? 'ring-1 ring-blue-500 text-blue-500' : ''
              }`}
            >
              Profile
            </Link>
            <Link
              prefetch='intent'
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
        <ProfileSideBar show={show} location={location} />
        <div className='col-span-8 md:p-4' onClick={() => setShow(false)}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Profile

interface SideBarProps {
  location: { pathname: string }
  show: boolean
}

const ProfileSideBar = ({ location, show }: SideBarProps) => (
  <aside
    className={`py-10 px-4 border-r relative border-slate-300 md:hidden justify-center transform transition duration-300 bg-white h-full w-60 z-50 ${
      show ? 'translate-x-0' : '-translate-x-96'
    }`}
  >
    <div className='md:hidden h-10 w-10 bg-white rounded-full shadow-sm flex justify-center items-center border border-blue-500 absolute z-50 -right-8 top-32'>
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'>
        <path fill='none' d='M0 0h24v24H0z' />
        <path d='M10.828 12l4.95 4.95-1.414 1.414L8 12l6.364-6.364 1.414 1.414z' />
      </svg>
    </div>
    <div className='w-full'>
      <Link
        prefetch='intent'
        to='/setting'
        className={`block px-4 py-3 bg-gray-200 font-medium my-2 text-sm rounded-xl hover:ring-1 hover:ring-blue-500 hover:text-blue-500 transition duration-300  ${
          location.pathname === '/setting' ? 'ring-1 ring-blue-500 text-blue-500' : ''
        }`}
      >
        Account
      </Link>
      <Link
        prefetch='intent'
        to='profile'
        className={`block px-4 py-3 bg-gray-200 font-medium my-2 text-sm rounded-xl hover:ring-1 hover:ring-blue-500 hover:text-blue-500 transition duration-300 ${
          location.pathname === '/setting/profile' ? 'ring-1 ring-blue-500 text-blue-500' : ''
        }`}
      >
        Profile
      </Link>
      <Link
        prefetch='intent'
        to='password'
        className={`block px-4 py-3 bg-gray-200 font-medium text-sm my-2 rounded-xl hover:ring-1 hover:ring-blue-500 hover:text-blue-500 transition duration-300 ${
          location.pathname === '/setting/password' ? 'ring-1 ring-blue-500 text-blue-500' : ''
        }`}
      >
        Password
      </Link>
    </div>
  </aside>
)
