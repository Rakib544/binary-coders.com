interface DropDownProps {
  fullName: string
  username: string
  profilePicture: string
}

import { Menu, Transition } from '@headlessui/react'
import { Form, Link } from '@remix-run/react'
import { blurImgUrl } from 'data/blur-img-url'
import { Fragment } from 'react'
import BlurrableImage from './blurable-img'
import AskQuestionIcon from './icons/ask-question-icon'
import LogoutIcon from './icons/logout-icon'
import PencilIcon from './icons/pencil-icon'
import SettingIcon from './icons/setting-icon'

export default function Dropdown({ fullName, username, profilePicture }: DropDownProps) {
  return (
    <Menu as='div' className='relative inline-block text-left'>
      <div>
        <Menu.Button className='inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none'>
          <div className='bg-gradient-to-r from-cyan-500 to-blue-500  p-0.5 rounded-full'>
            <div className='bg-white p-0.5 rounded-full z-10'>
              <BlurrableImage
                blurDataURl={blurImgUrl}
                className='h-12 w-12 mx-auto relative'
                img={
                  <img
                    src={profilePicture}
                    alt={username}
                    loading='lazy'
                    className='h-12 w-12 rounded-full object-cover block object-center align-middle cursor-pointer'
                  />
                }
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
                className='px-4 py-2 bg-blue-500 shadow-blue-500/30 shadow-xl text-white inline-block text-sm rounded-full mt-2 mb-4'
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
                  className='py-3 px-4 w-full flex hover:bg-gray-100 text-slate-700 items-center space-x-2'
                >
                  <PencilIcon />
                  <span className='text-sm'>Write Blogs</span>
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {() => (
                <Link
                  prefetch='intent'
                  to='/question/create'
                  className='py-3 px-4 w-full flex hover:bg-gray-100 text-slate-700 items-center space-x-2'
                >
                  <AskQuestionIcon />
                  <span className='text-sm'>Ask Question</span>
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {() => (
                <Link
                  prefetch='intent'
                  to='/setting'
                  className='py-3 px-4 w-full flex hover:bg-gray-100 text-slate-700 items-center space-x-2'
                >
                  <SettingIcon />
                  <span className='text-sm'>Settings</span>
                </Link>
              )}
            </Menu.Item>
            <Form method='post' action='/auth/logout'>
              <Menu.Item>
                {() => (
                  <button
                    className='py-3 px-4 w-full flex hover:bg-gray-100 text-slate-700 items-center space-x-2'
                    type='submit'
                  >
                    <LogoutIcon />
                    <span className='text-sm'>Logout</span>
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
