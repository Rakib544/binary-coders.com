import { LinksFunction, LoaderFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { motion } from 'framer-motion'
import highlightCss from 'highlight.js/styles/atom-one-dark.css'
import quillCss from 'quill/dist/quill.snow.css'
import { getSingleBlog } from '~/utils/blog.server'

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: highlightCss },
    { rel: 'stylesheet', href: quillCss },
  ]
}

export const loader: LoaderFunction = async ({ params }) => {
  try {
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
  const loaderData = useLoaderData()
  if (loaderData.status === 404) {
    return <div>{loaderData.message}</div>
  }
  if (loaderData.status === 500) {
    return <div>{loaderData.message}</div>
  }

  const { blog, creatorInfo } = loaderData

  return (
    <motion.div
      className='w-full md:w-2/3 mx-auto p-4'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className='my-10'>
        <p className='mb-2'>
          {new Date(blog.createdAt).toDateString()} -{' '}
          <span className='bg-sky-400/10 p-2 rounded-md text-sky-600'>{blog.readTime}</span>
        </p>
        <h1 className='text-2xl md:text-4xl font-extrabold text-slate-800'>{blog.title}</h1>
        <div className='flex items-center space-x-4 text-sky-600 text-md mt-2'>
          <img
            className='h-12 rounded-full w-12 object-fill object-center'
            src={creatorInfo.profilePicture}
            alt={creatorInfo.name}
          />
          <p className='cursor-pointer'>{creatorInfo.name}</p>
        </div>
      </div>
      <div
        dangerouslySetInnerHTML={{ __html: blog.html }}
        className='prose prose-slate lg:prose-lg max-w-none mb-24 prose-a:text-blue-600'
      ></div>
    </motion.div>
  )
}

export default SingleBlog
