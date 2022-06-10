import { Link } from '@remix-run/react'
import { headerNavLinks } from 'data/navbar'
const Navbar = () => {
  return (
    <div className='flex items-center justify-between w-full'>
      <Link to='/'>
        <img
          src='https://i.ibb.co/KX9YN7Z/logo-01.png'
          alt='logo'
          className='h-12 w-auto object-cover'
        />
      </Link>
      <div className='hidden md:block'>
        {headerNavLinks.map((link) => (
          <Link
            key={link.title}
            to={link.href}
            className='p-1 font-medium text-gray-900 transition-all duration-500 hover:underline hover:decoration-sky-500 hover:decoration-2 hover:underline-offset-8 sm:p-4'
          >
            {link.title}
          </Link>
        ))}
        <Link to='/auth/login' className='px-10 py-3 bg-blue-600 text-white rounded-full'>
          Login
        </Link>
      </div>
    </div>
  )
}

export default Navbar
