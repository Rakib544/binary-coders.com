import type { LinksFunction, LoaderFunction, MetaFunction } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react'
import MessengerCustomerChat from 'react-messenger-customer-chat'
import Footer from './components/footer/footer'
import Navbar from './components/navbar'
import styles from './styles/app.css'
import { getUserInfo } from './utils/session.server'

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap',
    },
  ]
}

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Binary Coders',
  viewport: 'width=device-width,initial-scale=1',
})

export const loader: LoaderFunction = async ({ request }) => {
  const res = await getUserInfo(request)
  return {
    ...res,
  }
}

export default function App() {
  const loaderData = useLoaderData()
  return (
    <html lang='en'>
      <head>
        <Meta />
        <Links />
      </head>
      <body className='font-barlow'>
        <Navbar
          username={loaderData?.username as string}
          profilePicture={loaderData?.profilePicture as string}
        />
        <Outlet />
        <Footer />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
        <MessengerCustomerChat pageId='104547992167816' appId='1392911071206859' />
      </body>
    </html>
  )
}
