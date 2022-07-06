import { LoaderFunction } from '@remix-run/node'
import { Link, useLoaderData, useLocation } from '@remix-run/react'
import EyeIcon from '~/components/icons/eye'
import SelectBox from '~/components/select'
import { H6 } from '~/components/typography'
// import { useReducedMotion } from 'framer-motion'
import { getAllProblems } from '~/utils/problems.server'
import { getUserInfo } from '~/utils/session.server'

export const loader: LoaderFunction = async ({ request }) => {
  const { role } = await getUserInfo(request)
  const url = new URL(request.url)
  const tag = url.search.split('=')[1]
  const res = await getAllProblems(tag as string)
  return {
    ...res,
    role,
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
  // const shouldReduceMotion = useReducedMotion()

  // const childVariants = {
  //   initial: { opacity: 0, y: shouldReduceMotion ? 0 : 25 },
  //   visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  // }

  const location = useLocation()

  return (
    <div className='grid grid-cols-10 gap-0 lg:gap-4'>
      <aside className='col-span-10 hidden md:col-span-2 lg:col-span-3 md:flex justify-center'>
        <div className='w-full md:px-2 lg:px-16 my-10'>
          {loaderData?.role === 'admin' && (
            <Link
              prefetch='intent'
              to='/problems/create'
              className='block bg-blue-500 py-3 px-4 rounded-xl text-white font-medium tracking-wide my-8 text-sm text-center'
            >
              Set Problems
            </Link>
          )}

          <Link
            to='/problems'
            prefetch='intent'
            className={`block px-4 py-3 bg-white font-medium my-2 text-sm rounded-xl hover:ring-1 hover:ring-blue-500 hover:text-blue-500 transition duration-300 ${
              location.search === '' ? 'ring-1 ring-blue-500 text-blue-500' : ''
            }`}
          >
            All
          </Link>
          <Link
            prefetch='intent'
            to='/problems?query=variable'
            className={`block px-4 py-3 bg-white font-medium my-2 text-sm rounded-xl hover:ring-1 hover:ring-blue-500 hover:text-blue-500 transition duration-300 ${
              location.search === '?query=variable' ? 'ring-1 ring-blue-500 text-blue-500' : ''
            }`}
          >
            Variable
          </Link>
          <Link
            prefetch='intent'
            to='/problems?query=condition'
            className={`block px-4 py-3 bg-white font-medium my-2 text-sm rounded-xl hover:ring-1 hover:ring-blue-500 hover:text-blue-500 transition duration-300 ${
              location.search === '?query=condition' ? 'ring-1 ring-blue-500 text-blue-500' : ''
            }`}
          >
            Condition
          </Link>
          <Link
            prefetch='intent'
            to='/problems?query=array'
            className={`block px-4 py-3 bg-white font-medium my-2 text-sm rounded-xl hover:ring-1 hover:ring-blue-500 hover:text-blue-500 transition duration-300 ${
              location.search === '?query=array' ? 'ring-1 ring-blue-500 text-blue-500' : ''
            }`}
          >
            Array
          </Link>
          <Link
            prefetch='intent'
            to='/problems?query=loop'
            className={`block px-4 py-3 bg-white font-medium my-2 text-sm rounded-xl hover:ring-1 hover:ring-blue-500 hover:text-blue-500 transition duration-300 ${
              location.search === '?query=loop' ? 'ring-1 ring-blue-500 text-blue-500' : ''
            }`}
          >
            Loop
          </Link>
          <Link
            prefetch='intent'
            to='/problems?query=function'
            className={`block px-4 py-3 bg-white font-medium my-2 text-sm rounded-xl hover:ring-1 hover:ring-blue-500 hover:text-blue-500 transition duration-300 ${
              location.search === '?query=function' ? 'ring-1 ring-blue-500 text-blue-500' : ''
            }`}
          >
            Function
          </Link>
        </div>
      </aside>
      <ul className='col-span-10 md:col-span-8 lg:col-span-7 px-4 md:px-4 lg:px-12'>
        <div>
          <SelectBox options={options} />
        </div>
        {loaderData?.problems?.map((problem: Problem) => (
          <li key={problem.slug}>
            <Link
              prefetch='intent'
              to={`/problems/${problem.slug}`}
              // variants={childVariants}
              className='block my-2 border border-gray-100 p-4 bg-white rounded-xl transition duration-300 hover:border-blue-500'
            >
              <div>
                <div className='grid grid-cols-10 items-center flex-end'>
                  <H6 className='md:truncate col-span-10 mt-4 md:mt-0 md:col-span-9 hover:underline'>
                    {problem.title}
                  </H6>
                  <div className='hidden col-span-10 md:col-span-1 md:flex space-x-2'>
                    <div className='flex items-center space-x-1'>
                      <EyeIcon />
                      <small>{problem.views}</small>
                    </div>
                  </div>
                </div>
                <ul className='flex space-x-2 my-2'>
                  {problem.tags?.map((tag) => (
                    <li key={tag}>
                      <small className='px-2 py-1 rounded-md text-sky-600 bg-sky-400/10'>
                        {tag}
                      </small>
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
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Index
