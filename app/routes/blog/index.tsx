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

  if (url.search.startsWith('?query=me')) {
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

  const [pageNumber, setPageNumber] = React.useState(0)
  const [posts, setPosts] = React.useState(loaderData?.posts)
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
    if (location.search === '?query=me') {
      fetcher.load(`/blog?query=me&index&page=${pageNumber + 1}`)
    } else {
      fetcher.load(`/blog?index&page=${pageNumber + 1}`)
    }
  }, [pageNumber])

  React.useEffect(() => {
    if (fetcher.data?.posts?.length === 0) {
      setHasMore(false)
      return
    }
    if (fetcher.data?.posts) {
      if (posts[0]?.title === fetcher.data?.posts[0]?.title) {
        return
      }

      if (location.search === '?query=me') {
        if (fetcher.data?.posts?.every((post: Post) => post.authorId === loaderData?.userId)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setPosts((prevPosts: any) => {
            return [...new Set([...prevPosts, ...fetcher.data.posts])]
          })
        }
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setPosts((prevPosts: any) => {
          return [...new Set([...prevPosts, ...fetcher.data.posts])]
        })
      }
    }
  }, [fetcher.data])

  React.useEffect(() => {
    setPageNumber(0)
    setHasMore(true)
    // eslint-disable-next-line no-unsafe-optional-chaining
    setPosts([...loaderData?.posts])
  }, [location.search])

  return (
    <div>
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
          <div>
            <SelectBox options={options} />
          </div>
          <div className='my-10'>
            <AnimatePresence>
              {posts?.map((post: Post, index: number) => {
                if (posts?.length === index + 1) {
                  return (
                    <div ref={lastPostElementRef} key={post.slug}>
                      <BlogCard {...post} />
                    </div>
                  )
                } else {
                  return <BlogCard key={post.slug} {...post} />
                }
              })}
            </AnimatePresence>
            {fetcher.state === 'loading' && <p>Loading...</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default index
