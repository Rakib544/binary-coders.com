import { Link, useLocation } from '@remix-run/react'
import { headerNavLinks } from 'data/navbar'
import * as React from 'react'
import Dropdown from './dropdown'
import MobileNav from './mobile-nav'

const NAVBAR_HIDES_FROM = ['/auth/login', '/auth/register']

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

const Navbar = ({ username, profilePicture }: { username: string; profilePicture: string }) => {
  const location = useLocation()
  const isNavbarHide = NAVBAR_HIDES_FROM.includes(location.pathname)

  const [showDropMenu, setShowDropMenu] = React.useState<boolean>(false)

  return (
    <>
      {!isNavbarHide ? (
        <div className='flex justify-between items-center py-4 px-2 md:px-10'>
          <div className='flex items-center justify-between w-full'>
            <Link to='/'>
              <img
                src='https://i.ibb.co/KX9YN7Z/logo-01.png'
                alt='logo'
                className='h-12 w-auto object-cover'
              />
            </Link>
            <ul className='hidden md:flex items-center'>
              {headerNavLinks.map((link) => (
                <NavLink key={link.href} to={link.href}>
                  {link.title}
                </NavLink>
              ))}
              {username ? (
                <div className='relative' onClick={() => setShowDropMenu(!showDropMenu)}>
                  <img
                    src={profilePicture}
                    alt={username}
                    className='h-12 w-12 rounded-full object-cover object-center align-middle border-2 border-blue-500 cursor-pointer'
                  />
                  <Dropdown
                    username={username}
                    profilePicture={profilePicture}
                    showDropMenu={showDropMenu}
                  />
                </div>
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
          <MobileNav />
        </div>
      ) : null}
    </>
  )
}

export default Navbar
