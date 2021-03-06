import {
  ActionFunction,
  json,
  LinksFunction,
  LoaderFunction,
  MetaFunction,
  redirect,
} from '@remix-run/node'
import { Form, Link, useActionData, useFetcher, useLoaderData, useParams } from '@remix-run/react'
import { AnimatePresence, motion } from 'framer-motion'
import highlightCss from 'highlight.js/styles/atom-one-dark.css'
import moment from 'moment'
import quillCss from 'quill/dist/quill.snow.css'
import * as React from 'react'
import EyeIcon from '~/components/icons/eye-icon'
import ReadTime from '~/components/icons/readTime'
import ViewersModal from '~/components/viewers-modal'
import { addBlogReader, deleteBlog, getBlogViewers, getSingleBlog } from '~/utils/blog.server'

import modalStyles from '@reach/dialog/styles.css'
import { BackButton } from '~/components/button'
import MenuDropDown from '~/components/menu-dropdown'
import { getUserId, getUserInfo } from '~/utils/session.server'

const easing = [0.6, -0.05, 0.01, 0.99]

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
}

const fadeInUp = {
  initial: {
    y: 10,
    opacity: 0,
    transition: { duration: 0.6, ease: easing },
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
}

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: highlightCss },
    { rel: 'stylesheet', href: quillCss },
    { rel: 'stylesheet', href: modalStyles },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&display=swap',
    },
  ]
}

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData()
  const { action } = Object.fromEntries(formData)

  if (action === 'delete') {
    const res = await deleteBlog(params.slug as string)
    if (res.status === 200) {
      return redirect('/blog')
    }
  }

  if (action === 'incrementView') {
    const { userId } = await getUserInfo(request)
    await addBlogReader(params.slug as string, userId as string)
    return null
  }
  const res = await getBlogViewers(params.slug as string)
  return json(res)
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await getUserId(request)
  if (!userId) {
    return redirect('/auth/login')
  }
  const res = await getSingleBlog(params.slug as string)
  const data = {
    ...res,
    userId: userId,
  }
  return json(data)
}

export const meta: MetaFunction = ({ data }: { data: { blog: { title: string } } }) => {
  return {
    title: `${data?.blog?.title || '404 - No blog found'} `,
    description: `${data?.blog?.title || 'No blog found'}`,
  }
}

const SingleBlog = () => {
  const actionData = useActionData()
  const loaderData = useLoaderData()

  const [open, setOpen] = React.useState(false)

  const { blog, creatorInfo } = loaderData

  const fetcher = useFetcher()

  React.useEffect(() => {
    const timeOut = setTimeout(() => {
      fetcher.submit({ name: 'rakib is calling', action: 'incrementView' }, { method: 'post' })
    }, 100)

    return () => clearTimeout(timeOut)
  }, [])

  const handleDelete = () => {
    fetcher.submit({ action: 'delete' }, { method: 'delete' })
  }

  return (
    <motion.div
      className='w-full md:w-2/3 mx-auto p-4'
      initial='initial'
      animate='animate'
      exit={{ opacity: 0 }}
    >
      <motion.div variants={stagger}>
        <motion.div variants={fadeInUp}>
          <BackButton to='/blog' />
        </motion.div>
        <motion.div variants={fadeInUp} className='my-10'>
          <div className='flex justify-end items-center space-x-4'>
            <div className='flex items-center space-x-1 cursor-pointer' title='See viewers'>
              <Form method='post'>
                <button
                  type='submit'
                  className='flex items-center space-x-1 cursor-pointer'
                  onClick={() => setOpen(true)}
                >
                  <EyeIcon />{' '}
                  <small className='text-xs text-slate-500 font-medium'>{blog.views}</small>
                </button>
              </Form>
            </div>
            <div className='flex items-center space-x-1'>
              <ReadTime />{' '}
              <small className='text-xs text-slate-500 font-medium'>{blog.readTime}</small>
            </div>
            {blog.authorId === loaderData?.userId && (
              <MenuDropDown handleDelete={handleDelete} url={`/blog/edit/${blog.slug}`} />
            )}
          </div>
          <motion.h1
            variants={fadeInUp}
            className='text-2xl md:text-3xl font-extrabold text-slate-700 my-4'
          >
            {blog.title}
          </motion.h1>
          <motion.div
            variants={fadeInUp}
            className='flex items-center text-sky-600 text-md mt-2 space-x-2'
          >
            <img
              className='rounded-full object-center h-10 w-10 object-cover'
              src={creatorInfo.profilePicture}
              alt={creatorInfo.name}
            />
            <div>
              <Link
                prefetch='intent'
                to={`/user/${creatorInfo.username}`}
                className='text-sky-500 font-medium'
              >
                {creatorInfo.name}
              </Link>
              <small className='block text-xs font-medium text-slate-500'>
                posted {moment(blog.createdAt).fromNow()}
              </small>
            </div>
          </motion.div>
        </motion.div>
        <motion.div
          variants={fadeInUp}
          dangerouslySetInnerHTML={{ __html: blog.html }}
          className='prose prose-slate lg:prose-lg max-w-none mb-24 prose-a:text-blue-600 siliguri-font'
        ></motion.div>
      </motion.div>
      <AnimatePresence>
        {actionData?.viewers && open && (
          <ViewersModal
            viewers={actionData?.viewers}
            onClose={() => setOpen(false)}
            pageName='blog'
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default SingleBlog

export function CatchBoundary() {
  const params = useParams()
  return (
    <div className='justify-center flex items-center my-20'>
      <div className='text-center'>
        <img src='/images/not-found.svg' alt='not found' className='h-48 mx-auto' />
        <h1 className='text-3xl font-medium my-10'>
          No blog found with this <span className='text-sky-500'>&quot;/{params.slug}&quot;</span>{' '}
          slug
        </h1>

        <Link
          to='/blog'
          className='px-8 sm:px-12 py-2 sm:py-3  bg-blue-500 text-white rounded-lg text-sm font-medium shadow-lg hover:bg-blue-600 transition duration-200 shadow-blue-500/50 my-6'
        >
          Back to Blog
        </Link>
      </div>
    </div>
  )
}
export function ErrorBoundary() {
  return (
    <div className='justify-center flex'>
      <div className='text-center mb-20'>
        {' '}
        <img
          src='/images/connection-lost.webp'
          alt='connection-lost-img'
          className='h-40 block mx-auto'
        />
        <h1 className='text-3xl font-medium text-slate-700'>Ooops!</h1>
        <h2 className='text-xl font-medium text-slate-500'>
          It maybe happens due to your slow internet connection or{' '}
          <p>Something unexpected went wrong. Sorry about that.</p>
        </h2>
        <p className='text-slate-500'>Try to reload again</p>
        <button
          className='px-8 sm:px-12 py-2 sm:py-3  bg-blue-500 text-white rounded-lg text-sm font-medium shadow-lg hover:bg-blue-600 transition duration-200 shadow-blue-500/50 my-6'
          onClick={() => window.location.reload()}
        >
          Refresh
        </button>
      </div>
    </div>
  )
}
