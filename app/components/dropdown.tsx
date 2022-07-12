interface DropDownProps {
  fullName: string
  username: string
  profilePicture: string
}

import { Menu, Transition } from '@headlessui/react'
import { Form, Link } from '@remix-run/react'
import { Fragment } from 'react'
import LogoutLogo from './icons/logout'

export default function Dropdown({ fullName, username, profilePicture }: DropDownProps) {
  return (
    <Menu as='div' className='relative inline-block text-left'>
      <div>
        <Menu.Button className='inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none'>
          <div className='bg-gradient-to-r from-cyan-500 to-blue-500  p-0.5 rounded-full'>
            <div className='bg-white p-0.5 rounded-full z-10'>
              <img
                src={profilePicture}
                alt={username}
                className='h-12 w-12 rounded-full object-cover block object-center align-middle cursor-pointer'
              />
            </div>
          </div>
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter='transition ease-out duration-100'
        enterFrom='transform opacity-0 scale-95'
        enterTo='transform opacity-100 scale-100'
        leave='transition ease-in duration-75'
        leaveFrom='transform opacity-100 scale-100'
        leaveTo='transform opacity-0 scale-95'
      >
        <Menu.Items className='origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50'>
          <>
            {' '}
            <div className='text-center my-2'>
              <div className='bg-gradient-to-r inline-block from-cyan-500 to-blue-500  p-0.5 rounded-full'>
                <div className='bg-white p-0.5 inline-block rounded-full'>
                  <img
                    src={profilePicture}
                    alt={username}
                    className='h-20 w-20 rounded-full object-cover inline-block object-center cursor-pointer mx-auto'
                  />
                </div>
              </div>
              <p className='text-lg font-medium mt-2'>{fullName}</p>
              <Link
                prefetch='intent'
                to={`/user/${username}`}
                className='px-4 py-2 bg-blue-600 text-white inline-block text-sm rounded-full mt-2 mb-4'
              >
                View Profile
              </Link>
            </div>
          </>
          <div className='py-1'>
            <Menu.Item>
              {() => (
                <Link
                  to='/blog/create'
                  className='py-3 px-4 w-full flex hover:bg-gray-100 text-slate-700'
                >
                  Write Blogs
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {() => (
                <Link
                  prefetch='intent'
                  to='/question/create'
                  className='py-3 px-4 w-full flex hover:bg-gray-100 text-slate-700'
                >
                  Ask Question
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {() => (
                <Link
                  prefetch='intent'
                  to='/setting'
                  className='py-3 px-4 w-full flex hover:bg-gray-100 text-slate-700'
                >
                  Settings
                </Link>
              )}
            </Menu.Item>
            <Form method='post' action='/auth/logout'>
              <Menu.Item>
                {() => (
                  <button
                    className='py-3 px-4 w-full flex hover:bg-gray-100 text-slate-700 my-2'
                    type='submit'
                  >
                    <LogoutLogo />
                    Logout
                  </button>
                )}
              </Menu.Item>
            </Form>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
