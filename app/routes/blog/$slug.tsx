import { LinksFunction, LoaderFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import highlightCss from 'highlight.js/styles/atom-one-dark.css'
import { getSingleBlog } from '~/utils/blog.server'

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: highlightCss }]
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
    <div className='mx-12 '>
      <div className='my-10'>
        <p className='mb-2'>
          {new Date(blog.createdAt).toDateString()} -{' '}
          <span className='bg-slate-100 p-2 rounded-md text-gray-400'>{blog.readTime}</span>
        </p>
        <h1 className='text-2xl md:text-4xl font-extrabold'>{blog.title}</h1>
        <div className='flex items-center space-x-4 text-sky-600 text-sm mt-2'>
          <img
            className='h-12 rounded-full w-12 object-fill object-center'
            src={creatorInfo.profilePicture}
            alt={creatorInfo.name}
          />
          <p className='cursor-pointer'>{creatorInfo.name}</p>
        </div>
      </div>
      <div dangerouslySetInnerHTML={{ __html: blog.html }} className='prose lg:prose-xl'></div>
    </div>
  )
}

export default SingleBlog
