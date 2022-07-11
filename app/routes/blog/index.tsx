import { json, LoaderFunction } from '@remix-run/node'
import { Link, useFetcher, useLoaderData, useLocation } from '@remix-run/react'
import { AnimatePresence, motion } from 'framer-motion'
import * as React from 'react'
import BlogCard from '~/components/blogCard'
import SelectBox from '~/components/select'
import { getAllBlogPosts } from '~/utils/blog.server'
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

// utility function for getting page number
const getPage = (searchParams: URLSearchParams) => Number(searchParams.get('page') || '1')

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url)

  const page = getPage(new URL(request.url).searchParams)

  const { userId } = await getUserInfo(request)

  if (url.search.startsWith('?query=me')) {
    const posts = await getAllBlogPosts(userId as string, page)
    const data = {
      ...posts,
      userId,
    }
    return json(data)
  } else {
    const posts = await getAllBlogPosts(null, page)
    const data = {
      ...posts,
      userId,
    }
    return json(data)
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
    <motion.div initial='initial' animate='animate' exit={{ opacity: 0 }}>
      <Link
        prefetch='intent'
        to='/blog/create'
        className='inline-block md:hidden mx-2 bg-blue-500 py-3 px-12 rounded-xl text-white font-medium tracking-wide my-8 text-sm text-center'
      >
        Write blog
      </Link>

      <div className='grid grid-cols-10 gap-0 lg:gap-4'>
        <aside className='col-span-10 hidden md:col-span-2 lg:col-span-3 md:flex justify-center'>
          <motion.div variants={stagger} className='w-full md:px-2 lg:px-16 my-10'>
            {loaderData?.userId && (
              <motion.div variants={fadeInUp}>
                {' '}
                <Link
                  prefetch='intent'
                  to='/blog/create'
                  className='block bg-blue-500 py-3 px-4 rounded-xl text-white font-medium tracking-wide my-8 text-sm text-center'
                >
                  Write blog
                </Link>
              </motion.div>
            )}
            <motion.div variants={fadeInUp}>
              <Link
                to='/blog'
                prefetch='intent'
                className={`block px-4 py-3 bg-white font-medium my-2 text-sm rounded-xl hover:ring-1 hover:ring-blue-500 hover:text-blue-500 transition duration-300 ${
                  location.search === '' ? 'ring-1 ring-blue-500 text-blue-500' : ''
                }`}
              >
                All Blogs
              </Link>
            </motion.div>
            {loaderData.userId && (
              <motion.div variants={fadeInUp}>
                <Link
                  to='/blog?query=me'
                  prefetch='intent'
                  className={`block px-4 py-3 bg-white font-medium my-2 text-sm rounded-xl hover:ring-1 hover:ring-blue-500 hover:text-blue-500 transition duration-300 ${
                    location.search === '?query=me' ? 'ring-1 ring-blue-500 text-blue-500' : ''
                  }`}
                >
                  My Blogs
                </Link>
              </motion.div>
            )}
          </motion.div>
        </aside>
        <motion.div
          variants={stagger}
          className='col-span-10 md:col-span-8 lg:col-span-7 px-4 md:px-4 lg:px-12'
        >
          <motion.div variants={fadeInUp}>
            <SelectBox key={location.search} options={options} />
          </motion.div>
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
        </motion.div>
      </div>
    </motion.div>
  )
}

export default index
