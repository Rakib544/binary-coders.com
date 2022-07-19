import { Link } from '@remix-run/react'
import { blurImgUrl } from 'data/blur-img-url'
import { motion } from 'framer-motion'
import moment from 'moment'
import BlurrableImage from './blurable-img'
import CommentIcons from './icons/comment-icon'
import EyeIcon from './icons/eye-icon'
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

const easing = [0.6, -0.05, 0.01, 0.99]

const fadeInUp = {
  initial: {
    y: 60,
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

const QuestionCard = ({ slug, title, createdAt, views, comments, creator }: Post) => {
  return (
    <motion.div variants={fadeInUp}>
      <Link
        prefetch='intent'
        to={`/question/${slug}`}
        className='bg-white py-4 px-4 rounded-xl grid grid-cols-10 my-4 shadow-2xl shadow-blue-500/10 border border-sky-50'
      >
        <div className='col-span-10 md:col-span-1 flex justify-between'>
          <BlurrableImage
            blurDataURl={blurImgUrl}
            className='h-14 w-14 relative'
            img={
              <img
                src={creator.profilePicture}
                alt={creator.name}
                className='rounded-xl h-14 w-14 object-cover'
              />
            }
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
                <small className='text-xs font-medium text-slate-500'>{views}</small>
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
              className='text-sky-500 font-medium'
            >
              {creator.name}
            </Link>
            {'  '}posted <span className='font-medium'>{moment(createdAt).fromNow()}</span>
          </small>
        </div>
      </Link>
    </motion.div>
  )
}

export default QuestionCard
