import { LinksFunction, LoaderFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { motion } from 'framer-motion'
import highlightCss from 'highlight.js/styles/atom-one-dark.css'
import quillCss from 'quill/dist/quill.snow.css'
import { getSingleProblem } from '~/utils/problems.server'

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: quillCss },
    { rel: 'stylesheet', href: highlightCss },
  ]
}

export const loader: LoaderFunction = async ({ params }) => {
  const res = await getSingleProblem(params.slug as string)
  return {
    ...res,
  }
}

const SingleQuestion = () => {
  const { problem } = useLoaderData()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className='grid grid-cols-5 mb-12'
    >
      <div className='p-4 col-span-5 md:col-span-2 h-screen overflow-auto'>
        <div className='border-b border-gray-200 pb-4'>
          <h1 className='text-4xl font-bold'>{problem?.title}</h1>
          <div className='space-x-4'>
            <small>Asked - {new Date(problem?.createdAt).toDateString()}</small>
            <small>Modified - {new Date(problem?.updatedAt).toDateString()}</small>
          </div>
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: problem?.description }}
          className='prose prose-slate lg:prose-md max-w-none mt-12 mb-32 prose-a:text-blue-600'
        />
      </div>
      <div className='col-span-5 md:col-span-3 p-4'>
        <iframe
          frameBorder='0'
          height='100%'
          src='https://onecompiler.com/embed/python'
          width='100%'
          // hideNew={true as boolean}
        ></iframe>
      </div>
    </motion.div>
  )
}

export default SingleQuestion
