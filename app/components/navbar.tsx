import { Link, useLocation } from '@remix-run/react'
import { headerNavLinks } from 'data/navbar'
import * as React from 'react'
import Dropdown from './dropdown'
import MobileNav from './mobile-nav'

const NAVBAR_HIDES_FROM = [
  '/auth/login',
  '/auth/register',
  '/auth/reset',
  '/auth/reset_password',
  '/auth/send-register-link',
]

const NavLink = ({ to, ...rest }: Omit<Parameters<typeof Link>['0'], 'to'> & { to: string }) => {
  const location = useLocation()

  const isSelected = to === location.pathname || location.pathname.startsWith(`${to}/`)

  return (
    <li className='px-5 py-5'>
      <Link
        prefetch='intent'
        className={`focus:outline-none block whitespace-nowrap text-md font-medium ${
          isSelected
            ? 'text-sky-500 underline decoration-2 decoration-sky-500 underline-offset-8'
            : 'text-slate-700'
        }`}
        to={to}
        {...rest}
      />
    </li>
  )
}

const Navbar = ({
  fullName,
  username,
  profilePicture,
}: {
  fullName: string
  username: string
  profilePicture: string
}) => {
  const location = useLocation()
  const isNavbarHide = NAVBAR_HIDES_FROM.includes(location.pathname)
  React.useEffect(() => {
    const body = document.body
    let topPosition = 0
    function handleNavbar() {
      const currentScroll = window.pageYOffset
      if (currentScroll <= 0) {
        body.classList.remove('scroll-up')
      }
      if (currentScroll > topPosition && !body.classList.contains('scroll-down')) {
        body.classList.remove('scroll-up')
        body.classList.add('scroll-down')
      }
      if (currentScroll < topPosition && body.classList.contains('scroll-down')) {
        body.classList.remove('scroll-down')
        body.classList.add('scroll-up')
      }

      topPosition = currentScroll
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleNavbar)
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', handleNavbar)
      }
    }
  }, [])
  return (
    <header>
      {!isNavbarHide ? (
        <div className='flex justify-between items-center py-4 px-2 md:px-10'>
          <div className='flex items-center justify-between w-full'>
            <Link prefetch='intent' to='/'>
              <img
                src='https://i.ibb.co/KX9YN7Z/logo-01.png'
                alt='logo'
                className='h-12 w-auto object-cover'
              />
            </Link>
            <ul className='hidden md:flex items-center'>
              {headerNavLinks.map((link) => (
                <NavLink key={link.href} to={link.href} prefetch='intent'>
                  {link.title}
                </NavLink>
              ))}
              {username ? (
                <Dropdown fullName={fullName} username={username} profilePicture={profilePicture} />
              ) : (
                <Link
                  to='/auth/login'
                  className='px-10 py-3 bg-blue-600 inline-block text-white rounded-full'
                >
                  Login
                </Link>
              )}
            </ul>
          </div>
          <MobileNav fullName={fullName} profilePicture={profilePicture} username={username} />
        </div>
      ) : null}
    </header>
  )
}

export default Navbar
