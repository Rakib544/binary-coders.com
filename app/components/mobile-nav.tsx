// import headerNavLinks from '@/data/headerNavLinks'
import { Link } from '@remix-run/react'
import { headerNavLinks } from 'data/navbar'
import { useState } from 'react'

const MobileNav = () => {
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
    <div className='sm:hidden'>
      <button
        type='button'
        className='ml-1 mr-1 h-8 w-8 rounded py-1'
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
        className={`supports-backdrop-blur:bg-white/95 fixed top-20 right-0 z-10 h-full w-full transform bg-white text-center backdrop-blur duration-300 ease-in-ou ${
          navShow ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <button
          type='button'
          aria-label='toggle modal'
          className='fixed h-full w-full cursor-auto focus:outline-none'
          onClick={onToggleNav}
        ></button>
        <nav className='fixed mt-8 h-full w-full'>
          {headerNavLinks.map((link) => (
            <div key={link.title} className=' px-4 py-4'>
              <Link
                to={link.href}
                className={'text-lg font-medium tracking-widest text-gray-900'}
                onClick={onToggleNav}
              >
                {link.title}
              </Link>
            </div>
          ))}
          <Link
            to='/auth/login'
            className='mt-4 block mx-2 px-10 py-3 bg-blue-600 text-white rounded-full'
          >
            Login
          </Link>
        </nav>
      </div>
    </div>
  )
}

export default MobileNav
