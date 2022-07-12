import modalStyles from '@reach/dialog/styles.css'
import {
  ActionFunction,
  json,
  LinksFunction,
  LoaderFunction,
  MetaFunction,
  redirect,
} from '@remix-run/node'
import { Form, Link, useActionData, useFetcher, useLoaderData } from '@remix-run/react'
import { AnimatePresence, motion } from 'framer-motion'
import highlightCss from 'highlight.js/styles/atom-one-dark.css'
import moment from 'moment'
import quillCss from 'quill/dist/quill.snow.css'
import * as React from 'react'
import { BackButton } from '~/components/button'
import EyeIcon from '~/components/icons/eye'
import MenuDropDown from '~/components/menu-dropdown'
import ViewersModal from '~/components/viewers-modal'
import {
  addProblemReader,
  deleteProblems,
  getProblemViewers,
  getSingleProblem,
} from '~/utils/problems.server'
import { getUserId, getUserInfo } from '~/utils/session.server'

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: quillCss },
    { rel: 'stylesheet', href: highlightCss },
    { rel: 'stylesheet', href: modalStyles },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&display=swap',
    },
  ]
}

export const meta: MetaFunction = ({
  data,
}: {
  data: {
    problem: {
      title: string
    }
  }
}) => {
  return {
    title: data?.problem?.title || '404 - Not found',
    description: data?.problem?.title || '404 - Not found',
  }
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await getUserId(request)

  if (!userId) {
    return redirect('/auth/login')
  }

  const { role } = await getUserInfo(request)
  const res = await getSingleProblem(params.slug as string)
  const data = {
    ...res,
    role,
  }
  return json(data)
}

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await getUserId(request)

  if (!userId) {
    return redirect('/auth/login')
  }

  const formData = await request.formData()
  const { action } = Object.fromEntries(formData)

  if (action === 'delete') {
    const res = await deleteProblems(params.slug as string)
    if (res.status === 200) {
      return redirect('/problems')
    }
  }

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
  const { problem, role } = useLoaderData()
  const actionData = useActionData()

  const [open, setOpen] = React.useState(false)

  const fetcher = useFetcher()

  React.useEffect(() => {
    const timer = setTimeout(() => {
      fetcher.submit({ action: 'incrementView' }, { method: 'post' })
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  const handleDelete = () => {
    fetcher.submit({ action: 'delete' }, { method: 'delete' })
  }

  return (
    <>
      {' '}
      <BackButton to={'/problems'} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className='grid grid-cols-5 mb-12'
      >
        <div className='p-4 col-span-5 md:col-span-2 h-screen overflow-auto'>
          <div className='border-b border-gray-200 pb-4'>
            <div className='flex items-center space-x-1 justify-end cursor-pointer'>
              <Form method='post'>
                <button
                  title='see viewers'
                  type='submit'
                  name='action'
                  value='getBlogViewers'
                  className='flex items-center space-x-1 cursor-pointer'
                  onClick={() => setOpen(true)}
                >
                  <EyeIcon />{' '}
                  <small className='text-xs text-slate-500 font-medium'>{problem.views}</small>
                </button>
              </Form>
              {role === 'admin' && (
                <MenuDropDown handleDelete={handleDelete} url={`/problems/edit/${problem?.slug}`} />
              )}
            </div>
            <h1 className='text-4xl font-bold'>{problem?.title}</h1>
            <small className='font-medium text-slate-500'>
              Posted {moment(problem.createdAt).fromNow()}
            </small>
          </div>
          <div
            dangerouslySetInnerHTML={{ __html: problem?.description }}
            className='prose prose-slate lg:prose-md max-w-none mt-12 mb-32 prose-a:text-blue-600 siliguri-font'
          />
        </div>
        <div className='col-span-5 md:col-span-3 p-4'>
          <iframe
            frameBorder='0'
            height='100%'
            src='https://onecompiler.com/embed/python'
            width='100%'
            className='h-screen'
            // hideNew={true as boolean}
          ></iframe>
        </div>
        <AnimatePresence>
          {actionData?.viewers && open && (
            <ViewersModal
              viewers={actionData?.viewers}
              onClose={() => setOpen(false)}
              pageName='problem'
            />
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}

export default SingleQuestion

export function ErrorBoundary() {
  return (
    <div className='justify-center flex items-center my-20'>
      <div className='text-center'>
        <img src='/images/not-found.svg' alt='not found' className='h-48 mx-auto' />
        <h1 className='text-3xl font-medium my-10'>No problems found with this slug.</h1>

        <Link
          to='/problems'
          className='px-8 sm:px-12 py-2 sm:py-3  bg-blue-500 text-white rounded-lg text-sm font-medium shadow-lg hover:bg-blue-600 transition duration-200 shadow-blue-500/50 my-6'
        >
          Back to all problems
        </Link>
      </div>
    </div>
  )
}
