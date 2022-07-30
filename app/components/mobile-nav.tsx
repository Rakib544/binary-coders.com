// import headerNavLinks from '@/data/headerNavLinks'
import { Form, Link } from '@remix-run/react'
import { headerNavLinks } from 'data/navbar'
import { useState } from 'react'
import NotificationDropDown from './notification-dropdown'

const mobileNavLinks = [{ href: '/', title: 'Home' }, ...headerNavLinks]

interface MobileNavProps {
  fullName: string
  profilePicture: string
  username: string
  NOTIFICATION_SERVER_URL: string
}

const MobileNav = ({
  fullName,
  profilePicture,
  username,
  NOTIFICATION_SERVER_URL,
}: MobileNavProps) => {
  const [navShow, setNavShow] = useState(false)

  const onToggleNav = () => {
    setNavShow((status) => {
      if (status) {
        document.body.style.overflow = 'auto'
      } else {
        // Prevent scrolling
        document.body.style.overflow = 'hidden'
      }
      return !status
    })
  }

  return (
    <div className='md:hidden'>
      <div className='flex items-center'>
        {username && <NotificationDropDown NOTIFICATION_SERVER_URL={NOTIFICATION_SERVER_URL} />}
        <button
          type='button'
          className='ml-1 mr-1 h-8 w-8 rounded py-1 z-50 relative'
          aria-label='Toggle Menu'
          onClick={onToggleNav}
        >
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'>
            {navShow ? (
              <>
                <path fill='none' d='M0 0h24v24H0z' />
                <path
                  d='M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z'
                  fill='#334155'
                />
              </>
            ) : (
              <>
                <path fill='none' d='M0 0h24v24H0z' />
                <path d='M3 4h18v2H3V4zm6 7h12v2H9v-2zm-6 7h18v2H3v-2z' fill='#334155' />
              </>
            )}
          </svg>
        </button>
      </div>
      <div
        className={` fixed top-0 right-0 z-20 h-full w-full transform bg-white duration-300 ease-in-out ${
          navShow ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <button
          type='button'
          aria-label='toggle modal'
          className='fixed h-full w-full cursor-auto focus:outline-none'
          onClick={onToggleNav}
        ></button>
        <nav className='fixed py-6 px-6  h-full w-full z-20'>
          {username && (
            <Link to={`/user/${username}`} prefetch='intent' onClick={onToggleNav}>
              <div className='flex items-center space-x-4 border-b border-slate-300 pb-4'>
                <img
                  src={profilePicture}
                  alt={username}
                  className='h-20 w-20 rounded-full object-cover'
                />
                <div>
                  <p className='text-xl font-medium mt-2 text-slate-500'>{fullName}</p>
                  <small className='text-sm font-semibold text-sky-500'>@{username}</small>
                </div>
              </div>
            </Link>
          )}
          {mobileNavLinks.map((link) => (
            <div key={link.title} className=' px-4 py-4'>
              <Link
                prefetch='intent'
                to={link.href}
                className={'text-lg font-medium tracking-widest text-slate-500'}
                onClick={onToggleNav}
              >
                {link.title}
              </Link>
            </div>
          ))}

          {!username ? (
            <Link
              prefetch='intent'
              to='/auth/login'
              className='px-8 sm:px-12 py-2 sm:py-3  bg-blue-500 text-white rounded-lg text-sm font-medium shadow-lg hover:bg-blue-600 transition duration-200 shadow-blue-500/50 inline-block my-4'
              onClick={onToggleNav}
            >
              Login
            </Link>
          ) : (
            <>
              <div key={'setting'} className=' px-4 py-4'>
                <Link
                  prefetch='intent'
                  to='/setting'
                  className={'text-lg font-medium tracking-widest text-slate-500'}
                  onClick={onToggleNav}
                >
                  Setting
                </Link>
              </div>
              <Form method='post' action='/auth/logout'>
                <button
                  type='submit'
                  className='px-8 sm:px-12 py-2 sm:py-3  bg-blue-500 text-white rounded-lg text-sm font-medium shadow-lg hover:bg-blue-600 transition duration-200 shadow-blue-500/50 inline-block my-4 border-2 border-blue-500 hover:border-blue-600'
                  onClick={onToggleNav}
                >
                  Logout
                </button>
              </Form>
            </>
          )}
        </nav>
      </div>
    </div>
  )
}

export default MobileNav
