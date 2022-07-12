import { json, LinksFunction, LoaderFunction, MetaFunction } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useTransition,
} from '@remix-run/react'
import { AnimatePresence, motion } from 'framer-motion'
import * as React from 'react'
import MessengerCustomerChat from 'react-messenger-customer-chat'
import { useSpinDelay } from 'spin-delay'
import Footer from './components/footer/footer'
import { Spinner } from './components/icons/spinner'
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
  try {
    const res = await getUserInfo(request)
    return json({
      ...res,
    })
  } catch (error) {
    throw new Error('Testing Error Boundary')
  }
}

const LOADER_WORDS = [
  'loading',
  'checking cdn',
  'checking cache',
  'fetching from db',
  'compiling mdx',
  'updating cache',
  'transfer',
]

const ACTION_WORDS = [
  'packaging',
  'zapping',
  'validating',
  'processing',
  'calculating',
  'computing',
  'computering',
]

// we don't want to show the loading indicator on page load
let firstRender = true

function PageLoadingMessage() {
  const transition = useTransition()
  const [words, setWords] = React.useState<Array<string>>([])
  const [pendingPath, setPendingPath] = React.useState('')
  const showLoader = useSpinDelay(Boolean(transition.state !== 'idle'))

  React.useEffect(() => {
    if (firstRender) return
    if (transition.state === 'idle') return
    if (transition.state === 'loading') setWords(LOADER_WORDS)
    if (transition.state === 'submitting') setWords(ACTION_WORDS)

    const interval = setInterval(() => {
      setWords(([first, ...rest]) => [...rest, first] as Array<string>)
    }, 2000)

    return () => clearInterval(interval)
  }, [pendingPath, transition.state])

  React.useEffect(() => {
    if (firstRender) return
    if (transition.state === 'idle') return
    setPendingPath(transition.location.pathname)
  }, [transition.location])

  React.useEffect(() => {
    firstRender = false
  }, [])

  const action = words[0]

  return (
    <>
      {showLoader ? (
        <motion.div className='fixed right-4 bottom-8 shadow-lg  bg-blue-500 text-white p-4 rounded-lg drop-shadow-2xl z-50'>
          <div className='flex w-64 items-center'>
            <div className='spin text-4xl'>
              <Spinner />
            </div>
            <div className='ml-4 inline-grid'>
              <AnimatePresence>
                <div className='col-start-1 row-start-1 flex overflow-hidden'>
                  <motion.span
                    key={action}
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -15, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className='flex-none '
                  >
                    {action}
                  </motion.span>
                </div>
              </AnimatePresence>
              <span className='text-white truncate'>path: {pendingPath}</span>
            </div>
          </div>
        </motion.div>
      ) : null}
    </>
  )
}

//

export default function App() {
  const loaderData = useLoaderData()
  return (
    <html lang='en' className='scroll-smooth'>
      <head>
        <Meta />
        <Links />
      </head>
      <body className='font-barlow bg-test'>
        <Navbar
          fullName={loaderData?.fullName as string}
          username={loaderData?.username as string}
          profilePicture={loaderData?.profilePicture as string}
        />
        <main className='relative'>
          <PageLoadingMessage />
          <Outlet />
          <ScrollRestoration />
          <Scripts />
          {process.env.NODE_ENV === 'development' && <LiveReload />}
          {process.env.NODE_ENV !== 'development' && (
            <MessengerCustomerChat pageId='104547992167816' appId='1392911071206859' />
          )}
        </main>
        <Footer />
      </body>
    </html>
  )
}

export function ErrorBoundary() {
  return (
    <html>
      <head>
        <title>Oh no! Something went wrong.</title>
        <Meta />
        <Links />
      </head>
      <body>
        <main className='flex items-center justify-center h-screen'>
          <div className='text-center'>
            <img
              src='/images/connection-lost.webp'
              alt='connection-lost'
              className='h-48 w-auto object-cover block mx-auto'
            />
            <h1 className='text-center font-medium text-3xl'>Slow or no internet connection</h1>
            <p>Please check your internet connection and then </p>
            <p>refresh the page</p>
            <button
              className='px-8 sm:px-12 py-2 sm:py-3  bg-blue-500 text-white rounded-lg text-sm font-medium shadow-lg hover:bg-blue-600 transition duration-200 shadow-blue-500/50 my-6'
              onClick={() => window.location.reload()}
            >
              Refresh
            </button>
          </div>
        </main>
        <Scripts />
      </body>
    </html>
  )
}
