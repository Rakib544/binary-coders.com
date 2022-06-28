import { Link } from '@remix-run/react'
import moment from 'moment'
import CommentIcons from './icons/comment-icon'
import EyeIcon from './icons/eye'
import { H6 } from './typography'

export type Post = {
  id: string
  createdAt: string
  title: string
  slug: string
  views: number
  comments: number
  creator: {
    username: string
    profilePicture: string
    name: string
  }
}

const QuestionCard = ({ slug, title, createdAt, views, comments, creator }: Post) => {
  return (
    <Link
      prefetch='intent'
      to={`/question/${slug}`}
      className='bg-white py-4 px-4 rounded-xl grid grid-cols-10 my-4'
    >
      <div className='col-span-10 md:col-span-1 flex justify-between'>
        <img
          src={creator.profilePicture}
          alt={creator.name}
          className='rounded-xl h-14 w-14 object-cover'
        />
        <div className='flex space-x-2 md:hidden'>
          <div className='flex items-center space-x-1'>
            <EyeIcon />
            <small>{views}</small>
          </div>
          <div className='flex items-center space-x-1'>
            <CommentIcons />
            <small className='text-xs font-medium text-slate-500'>{comments}</small>
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
              <small>{views}</small>
            </div>
            <div className='flex items-center space-x-1'>
              <CommentIcons />
              <small className='text-xs font-medium text-slate-500'>{comments}</small>
            </div>
          </div>
        </div>
        <small className='mt-4 block text-xs'>
          <Link
            prefetch='intent'
            to={`/user/${creator.username}`}
            className='text-blue-500 font-medium'
          >
            {creator.name}
          </Link>
          {'  '}posted <span className='font-medium'>{moment(createdAt).fromNow()}</span>
        </small>
      </div>
    </Link>
  )
}

export default QuestionCard
