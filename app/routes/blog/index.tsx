import type { LoaderFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
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

const index = () => {
  const { posts } = useLoaderData()
  // console.log(loaderData)
  return (
    <div className='mx-8 my-12'>
      <div className='lg:flex bg-slate-100 sm:flex-none my-12 lg:border-0 lg:rounded-r-lg'>
        <div className='flex justify-center items-center'>
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
          <h1 className='text-3xl'>New Needs To Meet It&apos;s Audience Where They Are</h1>
          <p className='pr-8 py-4 text-slate-500'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum officia maiores nulla ex
            impedit pariatur eveniet illum, necessitatibus voluptatem beatae iusto nisi optio
            voluptatibus labore obcaecati, quibusdam soluta eos at.
          </p>
          <div>
            <h4 className='text-xl font-medium'>Dave Roger</h4>
            <div className='flex text-slate-400'>
              <span className='pr-6 '>June 14</span>
              <li>3 min read</li>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default index
