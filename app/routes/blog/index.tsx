import type { LoaderFunction } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { getAllBlogPosts } from '~/utils/blog.server'

type PostProps = {
  id: string
  createdAt: string
  updatedAt: string
  title: string
  slug: string
  readTime: string
  html: string
  authorId: string
  comments: []
}

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

const index = () => {
  const { posts } = useLoaderData()
  return (
    <div className='px-12 my-12'>
      <div className='text-right'>
        <Link to='/blog/create' className='px-12 py-3 bg-blue-600 text-white rounded-full'>
          Write Blog
        </Link>
      </div>
      {posts?.map((post: Post) => (
        <Link to={post.slug} key={post.id}>
          <div className='bg-slate-100  my-12 rounded-lg sm:flex p-2 items-center'>
            <div className='flex justify-center items-center w-full sm:w-1/4 mr-4'>
              <img
                src='https://i.ibb.co/mvg4qXt/csaba-balazs-q9-URsedw330-unsplash.jpg'
                alt='Empty!'
                className='rounded-lg'
              />
            </div>
            <div>
              <h1 className='text-2xl font-medium'>{post.title}</h1>
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
          </div>
        </Link>
      ))}
    </div>
  )
}

export default index
