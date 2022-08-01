import { Link, useLocation } from '@remix-run/react'
import { headerNavLinks } from 'data/navbar'
import * as React from 'react'
import binaryCodersLogo from '../assets/logo.webp'
import Dropdown from './dropdown'
import MobileNav from './mobile-nav'
import NotificationDropDown from './notification-dropdown'

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
    <li className='px-5'>
      <Link
        prefetch='intent'
        className={`focus:outline-none block whitespace-nowrap text-md font-medium ${
          isSelected
            ? 'text-sky-500 underline decoration-2 decoration-sky-500 underline-offset-8'
            : 'text-slate-500'
        }`}
        to={to}
        {...rest}
      />
    </li>
  )
}

const Navbar = ({
  NOTIFICATION_SERVER_URL,
  fullName,
  username,
  profilePicture,
}: {
  NOTIFICATION_SERVER_URL: string
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
        <div className='flex justify-between items-center py-4 md:py-2 px-2 md:px-10'>
          <div className='flex items-center justify-between w-full'>
            <Link prefetch='intent' to='/'>
              {/* <BlurrableImage
                blurDataURl={blurImgUrl}
                className='h-14 w-60 mx-auto relative flex items-center'
                img={
                  <img
                    src='/images/logo.webp'
                    alt='Binary Coders Logo'
                    // height='40'
                    // width='100'
                    className='h-12 w-60 object-center'
                  />
                }
              /> */}
              <img
                src={binaryCodersLogo}
                alt='Binary Coders Logo'
                // height='40'
                // width='100'
                className='h-12 w-auto object-center'
              />
            </Link>
            <ul className='hidden md:flex items-center'>
              {headerNavLinks.map((link) => (
                <NavLink key={link.href} to={link.href} prefetch='intent'>
                  {link.title}
                </NavLink>
              ))}
              {username && (
                <li>
                  <NotificationDropDown NOTIFICATION_SERVER_URL={NOTIFICATION_SERVER_URL} />
                </li>
              )}
              {username ? (
                <Dropdown fullName={fullName} username={username} profilePicture={profilePicture} />
              ) : (
                <Link
                  to='/auth/login'
                  className='px-8 sm:px-12 py-2 sm:py-3  bg-blue-500 text-white rounded-lg text-sm font-medium shadow-lg hover:bg-blue-600 transition duration-200 shadow-blue-500/50 inline-block my-4'
                >
                  Login
                </Link>
              )}
            </ul>
          </div>
          <MobileNav
            fullName={fullName}
            profilePicture={profilePicture}
            username={username}
            NOTIFICATION_SERVER_URL={NOTIFICATION_SERVER_URL}
          />
        </div>
      ) : null}
    </header>
  )
}

export default Navbar
