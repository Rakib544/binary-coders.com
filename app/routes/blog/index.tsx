import type { LoaderFunction } from '@remix-run/node'
import { Link, useFetcher, useLoaderData, useLocation } from '@remix-run/react'
import { AnimatePresence } from 'framer-motion'
import * as React from 'react'
import BlogCard from '~/components/blogCard'
import SelectBox from '~/components/select'
import { getAllBlogPosts } from '~/utils/blog.server'
import { getUserInfo } from '~/utils/session.server'

// utility function for getting page number
const getPage = (searchParams: URLSearchParams) => Number(searchParams.get('page') || '1')

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url)

  const page = getPage(new URL(request.url).searchParams)
  const { userId } = await getUserInfo(request)

  if (url.search === '?query=me') {
    const posts = await getAllBlogPosts(userId as string, page)
    return {
      ...posts,
      userId,
    }
  } else {
    const posts = await getAllBlogPosts(null, page)
    return {
      ...posts,
      userId,
    }
  }
}

export type Post = {
  id: string
  createdAt: string
  updatedAt: string
  title: string
  slug: string
  readTime: string
  html: string
  authorId: string
  views: number
  creator: {
    username: string
    profilePicture: string
    name: string
  }
}

const options = [
  {
    id: 1,
    name: 'All Blogs',
    url: '/blog',
  },
  {
    id: 2,
    name: 'My Blogs',
    url: '/blog?query=me',
  },
]

const index = () => {
  const location = useLocation()
  const loaderData = useLoaderData()
  const fetcher = useFetcher()
  const [posts, setPosts] = React.useState<Post[]>(loaderData?.posts)
  const [scrollPosition, setScrollPosition] = React.useState<number>(0)
  const [clientHeight, setClientHeight] = React.useState<number>(0)

  React.useEffect(() => {
    const scrollListener = () => {
      setClientHeight(window.innerHeight)
      setScrollPosition(window.scrollY)
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', scrollListener)
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', scrollListener)
      }
    }
  }, [])

  // console.log({ scrollPosition, clientHeight })
  const [height, setHeight] = React.useState(null)
  const divHeight = React.useCallback(
    (node) => {
      if (node !== 'null') {
        setHeight(node.getBoundingClientRect().height)
      }
    },
    [loaderData?.posts?.length],
  )

  const [page, setPage] = React.useState(2)
  const [shouldFetch, setShouldFetch] = React.useState(true)
  React.useEffect(() => {
    if (!shouldFetch || !height) return
    if (clientHeight + scrollPosition + 100 < height) return
    fetcher.load(`/blog?index&page=${page}`)

    setShouldFetch(false)
  }, [clientHeight, scrollPosition, fetcher])

  // console.log(fetcher)

  React.useEffect(() => {
    // Discontinue API calls if the last page has been reached
    if (fetcher.data && fetcher.data.length === 0) {
      setShouldFetch(false)
      return
    }

    // Photos contain data, merge them and allow the possiblity of another fetch
    if (fetcher.data && fetcher.data?.posts?.length > 0) {
      setPosts(fetcher.data.posts)
      setPage((page: number) => page + 1)
      setShouldFetch(true)
    }
  }, [fetcher.data?.posts])

  return (
    <div ref={divHeight}>
      <Link
        prefetch='intent'
        to='/blog/create'
        className='inline-block md:hidden mx-2 bg-blue-500 py-3 px-12 rounded-xl text-white font-medium tracking-wide my-8 text-sm text-center'
      >
        Write blog
      </Link>

      <div className='grid grid-cols-10 gap-0 lg:gap-4'>
        <aside className='col-span-10 hidden md:col-span-2 lg:col-span-3 md:flex justify-center'>
          <div className='w-full md:px-2 lg:px-16 my-10'>
            {loaderData?.userId && (
              <Link
                prefetch='intent'
                to='/blog/create'
                className='block bg-blue-500 py-3 px-4 rounded-xl text-white font-medium tracking-wide my-8 text-sm text-center'
              >
                Write blog
              </Link>
            )}
            <Link
              to='/blog'
              prefetch='intent'
              className={`block px-4 py-3 bg-white font-medium my-2 text-sm rounded-xl hover:ring-1 hover:ring-blue-500 hover:text-blue-500 transition duration-300 ${
                location.search === '' ? 'ring-1 ring-blue-500 text-blue-500' : ''
              }`}
            >
              All Blogs
            </Link>
            {loaderData.userId && (
              <Link
                to='/blog?query=me'
                prefetch='intent'
                className={`block px-4 py-3 bg-white font-medium my-2 text-sm rounded-xl hover:ring-1 hover:ring-blue-500 hover:text-blue-500 transition duration-300 ${
                  location.search === '?query=me' ? 'ring-1 ring-blue-500 text-blue-500' : ''
                }`}
              >
                My Blogs
              </Link>
            )}
          </div>
        </aside>
        <div className='col-span-10 md:col-span-8 lg:col-span-7 px-4 md:px-4 lg:px-12'>
          {/* <div className='flex justify-end'>
            <label className='relative block'>
              <span className='sr-only'>Search</span>
              <span className='absolute inset-y-0 left-0 flex items-center pl-2'>
                <svg className='h-5 w-5 fill-slate-300' viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
                    clipRule='evenodd'
                  ></path>
                </svg>
              </span>
              <input
                className='placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm'
                placeholder='Search for anything...'
                type='text'
                name='search'
              />
            </label>
          </div> */}
          <div>
            <SelectBox options={options} />
          </div>
          <div className='my-10'>
            <AnimatePresence>
              {posts?.map((post: Post) => (
                <BlogCard key={post.slug} {...post} />
              ))}
            </AnimatePresence>
            {fetcher.state === 'loading' && <p>Loading...</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default index
