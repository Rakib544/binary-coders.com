import { LoaderFunction, MetaFunction } from '@remix-run/node'
import { Link, useFetcher, useLoaderData, useLocation } from '@remix-run/react'
import { motion } from 'framer-motion'
import * as React from 'react'
import EyeIcon from '~/components/icons/eye-icon'
import SelectBox from '~/components/select'
import { H6 } from '~/components/typography'
import { getAllProblems } from '~/utils/problems.server'
import { getUserInfo } from '~/utils/session.server'

const easing = [0.6, -0.05, 0.01, 0.99]

const fadeInUp = {
  initial: {
    y: 40,
    opacity: 0,
    transition: { duration: 0.6, ease: easing },
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: easing,
    },
  },
}

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
}

const sortOptions = [
  { label: 'All', to: '/problems', active: '' },
  { label: 'Variable', to: '/problems?query=variable', active: '?query=variable' },
  { label: 'Condition', to: '/problems?query=condition', active: '?query=condition' },
  { label: 'Array', to: '/problems?query=array', active: '?query=array' },
  { label: 'Loop', to: '/problems?query=loop', active: '?query=loop' },
  { label: 'Function', to: '/problems?query=function', active: '?query=function' },
]

const getPage = (searchParams: URLSearchParams) => Number(searchParams.get('page') || '1')

export const loader: LoaderFunction = async ({ request }) => {
  const { role } = await getUserInfo(request)
  const page = getPage(new URL(request.url).searchParams)
  const url = new URL(request.url)
  const tag = url.searchParams.get('query')
  const res = await getAllProblems(tag as string, page)
  return {
    ...res,
    role,
  }
}
export const meta: MetaFunction = () => {
  return {
    title: 'Solve Problems - Binary Coders',
    description: 'Problems set for programming practices.',
  }
}

type Problem = {
  authorId: string
  createdAt: string
  description: string
  id: string
  slug: string
  tags: Array<string>
  title: string
  updatedAt: string
  views: number
}

type ProblemCard = {
  problem: Problem
}

const options = [
  {
    id: 1,
    name: 'All Problems',
    url: '/problems',
  },
  {
    id: 2,
    name: 'Variable',
    url: '/problems?query=variable',
  },
  {
    id: 3,
    name: 'Condition',
    url: '/problems?query=condition',
  },
  {
    id: 4,
    name: 'Array',
    url: '/problems?query=array',
  },
  {
    id: 5,
    name: 'Loop',
    url: '/problems?query=loop',
  },
  {
    id: 6,
    name: 'Function',
    url: '/problems?query=function',
  },
]

const Index = () => {
  const loaderData = useLoaderData()
  const location = useLocation()
  const fetcher = useFetcher()

  const [pageNumber, setPageNumber] = React.useState(0)
  const [problems, setProblems] = React.useState(loaderData?.problems)
  const [hasMore, setHasMore] = React.useState(true)

  const observer = React.useRef<IntersectionObserver>()
  const lastPostElementRef = React.useCallback(
    (node) => {
      if (observer?.current) observer?.current?.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0]?.isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1)
        }
      })
      if (node) observer?.current?.observe(node)
    },
    [hasMore, location.search, fetcher.data],
  )

  React.useEffect(() => {
    if (location.search) {
      fetcher.load(`/problems${location.search}&index&page=${pageNumber + 1}`)
    } else {
      fetcher.load(`/problems?index&page=${pageNumber + 1}`)
    }
  }, [pageNumber])

  React.useEffect(() => {
    if (fetcher.data?.problems?.length === 0) {
      setHasMore(false)
      return
    }

    if (fetcher.data?.problems) {
      if (problems[0]?.title === fetcher.data?.problems[0]?.title) {
        return
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setProblems((prevPosts: any) => {
        return [...new Set([...prevPosts, ...fetcher.data.problems])]
      })
      // }
    }
  }, [fetcher.data])

  React.useEffect(() => {
    setPageNumber(0)
    setHasMore(true)
    // eslint-disable-next-line no-unsafe-optional-chaining
    setProblems([...loaderData?.problems])
  }, [location.search])

  return (
    <motion.div
      initial='initial'
      animate='animate'
      exit={{ opacity: 0 }}
      className='grid grid-cols-10 gap-0 lg:gap-4'
    >
      <div className='block col-span-10 md:hidden mx-2'>
        {loaderData?.role === 'admin' && (
          <motion.div variants={fadeInUp} className='text-right'>
            {' '}
            <Link
              prefetch='intent'
              to='/problems/create'
              className='inline-block bg-blue-500 py-3 px-8 rounded-xl text-white font-medium tracking-wide my-8 text-sm text-center'
            >
              Set Problems
            </Link>
          </motion.div>
        )}
      </div>
      <aside className='col-span-10 hidden md:col-span-2 lg:col-span-3 md:flex justify-center'>
        <motion.div variants={stagger} className='w-full md:px-2 lg:px-16 mb-10 mt-6'>
          {loaderData?.role === 'admin' && (
            <motion.div variants={fadeInUp}>
              {' '}
              <Link
                prefetch='intent'
                to='/problems/create'
                className='block bg-blue-500 py-3 px-4 rounded-xl text-white font-medium tracking-wide my-8 text-sm text-center'
              >
                Set Problems
              </Link>
            </motion.div>
          )}

          {sortOptions.map(({ label, to, active }) => (
            <motion.div variants={fadeInUp} key={label}>
              <Link
                to={to}
                prefetch='intent'
                className={`block px-4 py-3 bg-white font-medium my-2 text-sm rounded-xl hover:ring-1 hover:ring-sky-500 hover:text-sky-500 transition duration-300 shadow-xl shadow-blue-500/10 ${
                  location.search === active ? 'ring-1 ring-sky-500 text-sky-500' : ''
                }`}
              >
                {label}
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </aside>
      <motion.ul
        variants={stagger}
        className='col-span-10 md:col-span-8 lg:col-span-7 px-4 md:px-4 lg:px-12 my-2 md:my-10'
      >
        <motion.div variants={fadeInUp} className='my-10 block md:hidden'>
          <SelectBox key={location.search} options={options} />
        </motion.div>
        {problems?.length === 0 ? (
          'No problems found'
        ) : (
          <>
            {problems?.map((problem: Problem, index: number) => {
              if (problems?.length === index + 1) {
                return (
                  <div ref={lastPostElementRef} key={problem.slug}>
                    <ProblemsCard problem={problem} />
                  </div>
                )
              } else {
                return <ProblemsCard key={problem.slug} problem={problem} />
              }
            })}
          </>
        )}
        {fetcher.state === 'loading' && <li>Loading...</li>}
      </motion.ul>
    </motion.div>
  )
}

export default Index

const ProblemsCard = ({ problem }: ProblemCard) => (
  <motion.li variants={fadeInUp} key={problem.slug}>
    <Link
      prefetch='intent'
      to={`/problems/${problem.slug}`}
      // variants={childVariants}
      className='block my-2 p-4 bg-white rounded-xl transition duration-300 shadow-2xl shadow-blue-500/10 border border-sky-50'
    >
      <div>
        <div className='grid grid-cols-10 items-center flex-end'>
          <H6 className='md:truncate col-span-10 mt-4 md:mt-0 md:col-span-9 hover:underline'>
            {problem.title}
          </H6>
          <div className='hidden col-span-10 md:col-span-1 md:flex space-x-2'>
            <div className='flex items-center space-x-1'>
              <EyeIcon />
              <small className='text-xs font-medium text-slate-500'>{problem.views}</small>
            </div>
          </div>
        </div>
        <ul className='flex space-x-2 my-2'>
          {problem.tags?.map((tag) => (
            <li key={tag}>
              <small className='px-2 py-1 rounded-md text-sky-600 bg-sky-400/10'>{tag}</small>
            </li>
          ))}
        </ul>
        <Link
          prefetch='intent'
          to={`/problems/${problem.slug}`}
          className='text-sm text-sky-500 font-medium my-1 inline-block'
        >
          Solve Problem &rarr;
        </Link>
      </div>
    </Link>
  </motion.li>
)

export function ErrorBoundary() {
  return (
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
  )
}
