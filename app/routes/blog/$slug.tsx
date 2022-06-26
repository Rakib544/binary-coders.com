import { ActionFunction, json, LinksFunction, LoaderFunction, redirect } from '@remix-run/node'
import { Form, Link, useActionData, useFetcher, useLoaderData } from '@remix-run/react'
import { motion } from 'framer-motion'
import highlightCss from 'highlight.js/styles/atom-one-dark.css'
import moment from 'moment'
import quillCss from 'quill/dist/quill.snow.css'
import * as React from 'react'
import EyeIcon from '~/components/icons/eye'
import ReadTime from '~/components/icons/readTime'
import ViewersModal from '~/components/viewers-modal'
import { addBlogReader, getBlogViewers, getSingleBlog } from '~/utils/blog.server'

import modalStyles from '@reach/dialog/styles.css'
import { getUserId, getUserInfo } from '~/utils/session.server'

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: highlightCss },
    { rel: 'stylesheet', href: quillCss },
    { rel: 'stylesheet', href: modalStyles },
  ]
}

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData()
  const { action } = Object.fromEntries(formData)
  if (action === 'incrementView') {
    const { userId } = await getUserInfo(request)
    await addBlogReader(params.slug as string, userId as string)
    return null
  }
  const res = await getBlogViewers(params.slug as string)
  return json(res)
}

export const loader: LoaderFunction = async ({ request, params }) => {
  try {
    const userId = await getUserId(request)
    if (!userId) {
      return redirect('/auth/login')
    }
    const res = await getSingleBlog(params.slug as string)
    return {
      ...res,
    }
  } catch (error) {
    return {
      status: 500,
      message: 'Something went wrong. Please try again',
    }
  }
}

const SingleBlog = () => {
  const actionData = useActionData()
  const loaderData = useLoaderData()
  if (loaderData.status === 404) {
    return <div>{loaderData.message}</div>
  }
  if (loaderData.status === 500) {
    return <div>{loaderData.message}</div>
  }

  const { blog, creatorInfo } = loaderData

  const fetcher = useFetcher()

  React.useEffect(() => {
    const timeOut = setTimeout(() => {
      fetcher.submit({ name: 'rakib is calling', action: 'incrementView' }, { method: 'post' })
    }, 100)

    return () => clearTimeout(timeOut)
  }, [])

  return (
    <motion.div
      className='w-full md:w-2/3 mx-auto p-4'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className='my-10'>
        <div className='flex justify-end items-center space-x-4'>
          <div className='flex items-center space-x-1 cursor-pointer' title='See viewers'>
            <Form method='post'>
              <button type='submit' className='flex items-center space-x-1 cursor-pointer'>
                <EyeIcon />{' '}
                <small className='text-xs text-slate-500 font-medium'>{blog.views}</small>
              </button>
            </Form>
          </div>
          <div className='flex items-center space-x-1'>
            <ReadTime />{' '}
            <small className='text-xs text-slate-500 font-medium'>{blog.readTime}</small>
          </div>
        </div>
        <h1 className='text-2xl md:text-4xl font-extrabold text-slate-800'>{blog.title}</h1>
        <div className='flex items-center text-sky-600 text-md mt-2 space-x-2'>
          <img
            className='rounded-xl object-center h-14 w-12 object-cover'
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
            <small className='block text-xs font-medium text-slate-400'>
              posted {moment(blog.createdAt).fromNow()}
            </small>
          </div>
        </div>
      </div>
      <div
        dangerouslySetInnerHTML={{ __html: blog.html }}
        className='prose prose-slate lg:prose-lg max-w-none mb-24 prose-a:text-blue-600'
      ></div>
      {actionData?.viewers && <ViewersModal viewers={actionData?.viewers} />}
    </motion.div>
  )
}

export default SingleBlog
