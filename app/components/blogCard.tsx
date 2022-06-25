import { Link } from '@remix-run/react'
import moment from 'moment'
import EyeIcon from './icons/eye'
import ReadTime from './icons/readTime'
import { H6 } from './typography'
export type Post = {
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

const BlogCard = ({ slug, title, createdAt, readTime }: Post) => {
  return (
    <Link
      prefetch='intent'
      to={`/blog/${slug}`}
      className='bg-white py-4 px-4 rounded-xl grid grid-cols-10 my-4'
    >
      <div className='col-span-10 md:col-span-1 flex justify-between'>
        <img src='https://i.ibb.co/JdLgZmq/user1.jpg' alt='test' className='rounded-xl h-14' />
        <div className='flex space-x-2 md:hidden'>
          <div className='flex items-center space-x-1'>
            <EyeIcon />
            <small>1</small>
          </div>
          <div className='flex items-center space-x-1'>
            <ReadTime />
            <small className='text-xs font-medium text-slate-500'>{readTime}</small>
          </div>
        </div>
      </div>
      <div className='col-span-9'>
        <div className='grid grid-cols-10 items-center gap-4'>
          <H6 className='md:truncate col-span-10 mt-4 md:mt-0 md:col-span-8 hover:underline'>
            {title}
          </H6>
          <div className='hidden col-span-10 md:col-span-2 md:flex space-x-2'>
            <div className='flex items-center space-x-1'>
              <EyeIcon />
              <small>1</small>
            </div>
            <div className='flex items-center space-x-1'>
              <ReadTime />
              <small className='text-xs font-medium text-slate-500'>{readTime}</small>
            </div>
          </div>
        </div>
        <small className='mt-4 block text-xs'>
          <Link to={'/user/rakib'} className='text-blue-500 font-medium'>
            Rakib
          </Link>
          {'  '}posted <span className='font-medium'>{moment(createdAt).fromNow()}</span>
        </small>
      </div>
    </Link>
  )
}

export default BlogCard
