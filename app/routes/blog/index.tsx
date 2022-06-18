import type { LoaderFunction } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { motion, useReducedMotion } from 'framer-motion'
import { getAllBlogPosts } from '~/utils/blog.server'

export const loader: LoaderFunction = async () => {
  const posts = await getAllBlogPosts()
  return {
    ...posts,
  }
}

type Post = {
  id: string
  createdAt: string
  updatedAt: string
  title: string
  slug: string
  readTime: string
  html: string
  authorId: string
  comment: Array<[]>
}

const Index = () => {
  const { posts } = useLoaderData()
  const shouldReduceMotion = useReducedMotion()

  const childVariants = {
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <motion.div
      className='px-4 md:px-20 lg:px-60 py-20'
      initial='initial'
      animate='visible'
      variants={{
        initial: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
      }}
    >
      <div className='text-right'>
        <Link
          to='/blog/create'
          className='px-8 sm:px-12 py-2 sm:py-3  bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition duration-200 shadow-blue-500/50 inline-block'
        >
          Write Blog
        </Link>
      </div>
      <motion.div variants={childVariants} className='mt-14'>
        {posts?.map((post: Post) => (
          <Link to={post.slug} key={post.id}>
            <motion.div className='bg-white shadow-sm hover:shadow-md transition duration-300 hover:bg-gray-50 my-4 rounded-lg sm:flex p-2 items-center'>
              <div className='flex justify-center items-center w-full sm:w-1/4 mr-4'>
                <img
                  src='https://i.ibb.co/mvg4qXt/csaba-balazs-q9-URsedw330-unsplash.jpg'
                  alt='Empty!'
                  className='rounded-lg h-full'
                />
              </div>
              <div>
                <h1 className='text-xl font-medium'>{post.title}</h1>
                <div>
                  <h4 className='text-md font-medium my-2'>
                    by - <span className='underline text-slate-700'>Dave Roger</span>
                  </h4>
                  <div className='flex text-slate-400'>
                    <span className='pr-6 '>{new Date(post.createdAt).toDateString()}</span>
                    <li>{post.readTime}</li>
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </motion.div>
    </motion.div>
  )
}

export default Index
