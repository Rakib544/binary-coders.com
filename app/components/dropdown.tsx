import { Form, Link } from '@remix-run/react'
import CloseIcon from './icons/close-icon'
import LogoutLogo from './icons/logout'

interface DropDownProps {
  username: string
  profilePicture: string
  showDropMenu: boolean
}

const Dropdown = ({ username, profilePicture, showDropMenu }: DropDownProps) => {
  return (
    <div
      className={`${
        showDropMenu ? '' : 'hidden'
      } absolute top-16 -left-36 bg-white w-52 rounded-lg shadow-lg z-50`}
    >
      <div className='flex justify-end p-2 cursor-pointer'>
        <CloseIcon />
      </div>
      <div className='text-center'>
        <div className='bg-gradient-to-r inline-block from-cyan-500 to-blue-500  p-0.5 rounded-full'>
          <div className='bg-white p-0.5 inline-block rounded-full'>
            <img
              src={profilePicture}
              alt={username}
              className='h-20 w-20 rounded-full object-cover inline-block object-center cursor-pointer mx-auto'
            />
          </div>
        </div>
        <p className='text-lg font-medium mt-2'>{username}</p>
        <Link
          to='/'
          className='px-4 py-2 bg-blue-600 text-white inline-block text-sm rounded-full mt-2 mb-4'
        >
          View Profile
        </Link>
      </div>
      <ul>
        <li>
          <Form method='post' action='/auth/logout'>
            <button
              className='py-3 px-4 w-full flex hover:bg-gray-100 text-slate-700 my-2'
              type='submit'
            >
              <LogoutLogo />
              Logout
            </button>
          </Form>
        </li>
      </ul>
    </div>
  )
}

export default Dropdown
