import type { LinksFunction, MetaFunction } from '@remix-run/node'
import { Link, Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react'
import MobileNav from './components/mobile-nav'
import styles from './styles/app.css'

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: styles }]
}

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'New Remix App',
  viewport: 'width=device-width,initial-scale=1',
})

const headerNavLinks = [
  { href: '/about', title: 'About' },
  { href: '/blog', title: 'Blog' },
  { href: '/projects', title: 'Projects' },
  { href: '/auth/register', title: 'Register' },
  { href: '/auth/login', title: 'Login' },
]

export default function App() {
  return (
    <html lang='en'>
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <div className='py-4 flex justify-between'>
          <Link to='/'>
            <img
              src='https://i.ibb.co/KX9YN7Z/logo-01.png'
              alt='logo'
              className='h-10 w-auto object-cover'
            />
          </Link>
          <div className='hidden md:block'>
            {headerNavLinks.map((link) => (
              <Link
                key={link.title}
                to={link.href}
                className={`p-1 font-medium text-gray-900 transition-all duration-500 hover:underline hover:decoration-sky-500 hover:decoration-2 hover:underline-offset-8 sm:p-4
                  }`}
              >
                {link.title}
              </Link>
            ))}
          </div>
          <MobileNav />
        </div>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  )
}
