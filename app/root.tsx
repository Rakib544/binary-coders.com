import { json, LinksFunction, LoaderFunction, MetaFunction } from '@remix-run/node'
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
  useLocation,
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
    {
      rel: 'preload',
      as: 'font',
      href: '/fonts/barlow-v12-latin-200.woff2',
      type: 'font/woff2',
      crossOrigin: 'anonymous',
    },
    {
      rel: 'preload',
      as: 'font',
      href: '/fonts/barlow-v12-latin-300.woff2',
      type: 'font/woff2',
      crossOrigin: 'anonymous',
    },
    {
      rel: 'preload',
      as: 'font',
      href: '/fonts/barlow-v12-latin-regular.woff2',
      type: 'font/woff2',
      crossOrigin: 'anonymous',
    },
    {
      rel: 'preload',
      as: 'font',
      href: '/fonts/barlow-v12-latin-500.woff2',
      type: 'font/woff2',
      crossOrigin: 'anonymous',
    },
    {
      rel: 'preload',
      as: 'font',
      href: '/fonts/barlow-v12-latin-500italic.woff2',
      type: 'font/woff2',
      crossOrigin: 'anonymous',
    },
    {
      rel: 'preload',
      as: 'font',
      href: '/fonts/barlow-v12-latin-600.woff2',
      type: 'font/woff2',
      crossOrigin: 'anonymous',
    },
    {
      rel: 'preload',
      as: 'font',
      href: '/fonts/barlow-v12-latin-700.woff2',
      type: 'font/woff2',
      crossOrigin: 'anonymous',
    },
    {
      rel: 'preload',
      as: 'font',
      href: '/fonts/barlow-v12-latin-800.woff2',
      type: 'font/woff2',
      crossOrigin: 'anonymous',
    },
    {
      rel: 'preload',
      as: 'font',
      href: '/fonts/barlow-v12-latin-900.woff2',
      type: 'font/woff2',
      crossOrigin: 'anonymous',
    },

    { rel: 'stylesheet', href: styles },
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
    if (transition.state === 'idle' || transition.type === 'actionSubmission') return
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

const marginHideFrom = [
  '/auth/login',
  '/auth/send-register-link',
  '/auth/reset',
  '/auth/register',
  '/auth/new-password',
]

function shouldAddMargin(pathName: string) {
  return !marginHideFrom.includes(pathName)
}

export default function App() {
  const loaderData = useLoaderData()
  const location = useLocation()
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
        <main className={`relative ${shouldAddMargin(location.pathname) ? 'mt-16 md:mt-32' : ''}`}>
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

export function CatchBoundary() {
  const caught = useCatch()
  const location = useLocation()
  if (caught.status === 404) {
    return (
      <html>
        <head>
          <title>Oh no! Something went wrong.</title>
          <Meta />
          <Links />
        </head>
        <body>
          <main className='flex items-center justify-center h-screen'>
            <div className='text-center w-full p-4 md:w-1/2'>
              <img
                src='/images/not-found.svg'
                alt='Not found page'
                className='h-48 w-auto object-cover block mx-auto'
              />
              <h1 className='text-center font-bold text-2xl mt-6'>
                404 - Oh no, you found a page that&apos;s missing stuff.
              </h1>
              <h3 className='text-lg font-medium mb-6'>
                &apos;{location.pathname}&apos; is not a page on Binary Coders So sorry.{' '}
              </h3>

              <div>
                <Link
                  to='/'
                  className='px-8 sm:px-12 py-2 sm:py-3  bg-blue-500 text-white rounded-lg text-sm font-medium shadow-lg hover:bg-blue-600 transition duration-200 shadow-blue-500/50 my-6'
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </main>
          <Scripts />
        </body>
      </html>
    )
  }

  throw new Error('Something went wrong')
}

export function ErrorBoundary() {
  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <div className='justify-center flex'>
          <div className='text-center mb-20'>
            {' '}
            <img
              src='/images/connection-lost.webp'
              alt='connection-lost-img'
              className='h-40 block mx-auto'
            />
            <h1 className='text-3xl font-medium text-slate-700'>Ooops!</h1>
            <h2 className='text-xl font-medium text-slate-500'>
              It maybe happens due to your slow internet connection or{' '}
              <p>Something unexpected went wrong. Sorry about that.</p>
            </h2>
            <p className='text-slate-500'>Try to reload again</p>
            <button
              className='px-8 sm:px-12 py-2 sm:py-3  bg-blue-500 text-white rounded-lg text-sm font-medium shadow-lg hover:bg-blue-600 transition duration-200 shadow-blue-500/50 my-6'
              onClick={() => window.location.reload()}
            >
              Refresh
            </button>
          </div>
        </div>
        <Scripts />
      </body>
    </html>
  )
}
