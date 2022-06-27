import modalStyles from '@reach/dialog/styles.css'
import { ActionFunction, json, LinksFunction, LoaderFunction, redirect } from '@remix-run/node'
import { Form, useActionData, useFetcher, useLoaderData } from '@remix-run/react'
import { motion } from 'framer-motion'
import highlightCss from 'highlight.js/styles/atom-one-dark.css'
import moment from 'moment'
import quillCss from 'quill/dist/quill.snow.css'
import * as React from 'react'
import EyeIcon from '~/components/icons/eye'
import ViewersModal from '~/components/viewers-modal'
import { addProblemReader, getProblemViewers, getSingleProblem } from '~/utils/problems.server'
import { getUserId } from '~/utils/session.server'

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: quillCss },
    { rel: 'stylesheet', href: highlightCss },
    { rel: 'stylesheet', href: modalStyles },
  ]
}

export const loader: LoaderFunction = async ({ params }) => {
  const res = await getSingleProblem(params.slug as string)
  return {
    ...res,
  }
}

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await getUserId(request)

  if (!userId) {
    return redirect('/auth/login')
  }

  const formData = await request.formData()
  const { action } = Object.fromEntries(formData)

  if (action === 'getBlogViewers') {
    const res = await getProblemViewers(params.slug as string)
    return json(res)
  }

  if (action === 'incrementView') {
    await addProblemReader(params.slug as string, userId as string)
    return null
  }
}

const SingleQuestion = () => {
  const { problem } = useLoaderData()
  const actionData = useActionData()

  const fetcher = useFetcher()

  React.useEffect(() => {
    const timer = setTimeout(() => {
      fetcher.submit({ action: 'incrementView' }, { method: 'post' })
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className='grid grid-cols-5 mb-12'
    >
      <div className='p-4 col-span-5 md:col-span-2 h-screen overflow-auto'>
        <div className='border-b border-gray-200 pb-4'>
          <div
            className='flex items-center space-x-1 justify-end cursor-pointer'
            title='see viewers'
          >
            <Form method='post'>
              <button
                type='submit'
                name='action'
                value='getBlogViewers'
                className='flex items-center space-x-1 cursor-pointer'
              >
                <EyeIcon />{' '}
                <small className='text-xs text-slate-500 font-medium'>{problem.views}</small>
              </button>
            </Form>
          </div>
          <h1 className='text-4xl font-bold'>{problem?.title}</h1>
          <small className='font-medium text-slate-500'>
            Posted {moment(problem.createdAt).fromNow()}
          </small>
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
      {actionData?.viewers && <ViewersModal viewers={actionData?.viewers} pageName='problem' />}
    </motion.div>
  )
}

export default SingleQuestion
