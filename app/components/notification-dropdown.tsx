import { Menu, Transition } from '@headlessui/react'
import { Link } from '@remix-run/react'
import * as React from 'react'
import { Fragment } from 'react'
import NotificationIcon from './icons/notification-icon'

export default function NotificationDropDown() {
  const [showNotification, setShowNotification] = React.useState(false)
  return (
    <Menu as='div' className='relative inline-block text-left'>
      <div>
        <Menu.Button className='inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none'>
          <div className='relative cursor-pointer'>
            <NotificationIcon />
            {showNotification && (
              <div className='absolute -top-0.5 right-0'>
                <span className='flex relative h-3 w-3'>
                  <span className='animate-ping absolute -top-0 inline-flex h-full w-full rounded-full bg-red-400 opacity-75'></span>
                  <span className='relative inline-flex rounded-full h-3 w-3 bg-red-500'></span>
                </span>
              </div>
            )}
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
        <Menu.Items className='origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 p-2 h-96 overflow-y-auto'>
          {[1, 2, 4, 5, 6, 5, 6, 8, 9, 0, 2, 1, 3, 4, 10, 12, 14, 17, 12, 40, 10].map((num) => (
            <Link to='/' key={num} className='block hover:bg-slate-100 p-2 rounded-xl'>
              <div className='grid grid-cols-10 '>
                <div className='col-span-3'>
                  <img
                    src='/images/user1.webp'
                    alt='user1'
                    className='w-12 rounded-full h-12 object-cover mt-1'
                  />
                </div>
                <div className='col-span-7'>
                  <p className='text-sm text-slate-700'>
                    <Link to='/' className='text-sky-500 font-medium'>
                      Rakib
                    </Link>{' '}
                    asked a question
                  </p>
                  <small className='text-xs font-medium'>1 minutes ago</small>
                </div>
              </div>
            </Link>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
