// import headerNavLinks from '@/data/headerNavLinks'
import { Form, Link } from '@remix-run/react'
import { headerNavLinks } from 'data/navbar'
import { useState } from 'react'

const mobileNavLinks = [{ href: '/', title: 'Home' }, ...headerNavLinks]

interface MobileNavProps {
  fullName: string
  profilePicture: string
  username: string
}

const MobileNav = ({ fullName, profilePicture, username }: MobileNavProps) => {
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
      <button
        type='button'
        className='ml-1 mr-1 h-8 w-8 rounded py-1 z-50 relative'
        aria-label='Toggle Menu'
        onClick={onToggleNav}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 20 20'
          fill='currentColor'
          className='text-gray-90'
        >
          {navShow ? (
            <path
              fillRule='evenodd'
              d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
              clipRule='evenodd'
            />
          ) : (
            <path
              fillRule='evenodd'
              d='M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
              clipRule='evenodd'
            />
          )}
        </svg>
      </button>
      <div
        className={`supports-backdrop-blur:bg-white/95 fixed top-0 right-0 z-10 h-full w-full transform bg-white backdrop-blur duration-300 ease-in-out ${
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
            <Link to={`/user/${username}`} onClick={onToggleNav}>
              <div className='flex items-center space-x-4 border-b border-slate-300 pb-4'>
                <img
                  src={profilePicture}
                  alt={username}
                  className='h-20 w-20 rounded-full object-cover'
                />
                <div>
                  <p className='text-2xl font-medium mt-2 text-blue-500'>{fullName}</p>
                </div>
              </div>
            </Link>
          )}
          {mobileNavLinks.map((link) => (
            <div key={link.title} className=' px-4 py-4'>
              <Link
                prefetch='intent'
                to={link.href}
                className={'text-lg font-medium tracking-widest text-gray-900'}
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
              className='mt-4 inline-block mx-2 px-10 py-3 bg-blue-600 text-white rounded-full'
            >
              Login
            </Link>
          ) : (
            <>
              <div key={'setting'} className=' px-4 py-4'>
                <Link
                  prefetch='intent'
                  to='/setting'
                  className={'text-lg font-medium tracking-widest text-gray-900'}
                  onClick={onToggleNav}
                >
                  Setting
                </Link>
              </div>
              <Form method='post' action='/auth/logout'>
                <button
                  type='submit'
                  className='mt-4 inline-block mx-2 px-10 py-3 bg-blue-600 text-white rounded-full'
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
