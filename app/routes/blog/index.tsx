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
    <div className='mx-8 my-12'>
      <div className='text-right'>
        <Link to='/blog/create' className='px-12 py-3 bg-blue-600 text-white rounded-full'>
          Create Blog
        </Link>
      </div>
      {posts?.map((post: Post) => (
        <Link to={post.slug} key={post.id}>
          <div className='bg-slate-100  my-12 lg:border-0 lg:rounded-r-lg sm:flex'>
            <div className='flex justify-center items-center w-full sm:w-1/4'>
              <img
                src='https://i.ibb.co/mvg4qXt/csaba-balazs-q9-URsedw330-unsplash.jpg'
                alt='Empty!'
                width='800px'
                height='1000px'
                className='lg:border-0 lg:rounded-r-lg'
              />
            </div>
            <div className='py-12 px-8'>
              <h3 className='text-2xl font-bold text-slate-400'>EDITOR&apos;S PICK</h3>
              <h1 className='text-3xl'>{post.title}</h1>
              <div>
                <h4 className='text-xl font-medium'>Dave Roger</h4>
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
