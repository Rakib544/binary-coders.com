import { LinksFunction, LoaderFunction } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import {
  FLOW_CONTROL_TOPICS,
  PYTHON_DATATYPES_TOPICS,
  PYTHON_FUNCTION_TOPICS,
  PYTHON_INTRODUCTION_TOPICS,
} from 'data/python-topics'
import highlightCss from 'highlight.js/styles/atom-one-dark.css'
import quillCss from 'quill/dist/quill.snow.css'
import DisCloserMenu from '~/components/disclouser'
import PencilIcon from '~/components/icons/pencil-icon'
import PythonMenuSideBar from '~/components/python-menu-sidebar'
import { getUserInfo } from '~/utils/session.server'
import { getSingleTopic } from '~/utils/topic.server'

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: highlightCss },
    { rel: 'stylesheet', href: quillCss },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&display=swap',
    },
  ]
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const res = await getSingleTopic(params.slug as string)
  const { role } = await getUserInfo(request)
  return {
    ...res,
    role,
  }
}

const TopicDetails = () => {
  const loaderData = useLoaderData()
  return (
    <div className='grid grid-cols-12 gap-6 px-4 lg:px-8 mb-10 pt-10 lg:pt-0'>
      <aside className='hidden lg:block col-span-0 lg:col-span-3 bg-white'>
        <div className=' h-screen overflow-y-scroll fixed bg-white w-72 inset-0'>
          <div className='mt-28'>
            {loaderData?.role === 'admin' && (
              <Link
                to='/python-programming/create-topic'
                className='block mx-2 px-4 py-2 rounded-lg text-center text-white text-sm font-medium bg-sky-500 mb-4'
              >
                Add Topic
              </Link>
            )}
            <DisCloserMenu topics={PYTHON_INTRODUCTION_TOPICS} title='Python Introduction' />
            <DisCloserMenu topics={FLOW_CONTROL_TOPICS} title='Python Flow Control' />
            <DisCloserMenu topics={PYTHON_FUNCTION_TOPICS} title='Python Function' />
            <DisCloserMenu topics={PYTHON_DATATYPES_TOPICS} title='Python Data Types' />
          </div>
        </div>
      </aside>
      <aside className='lg:hidden'>
        <PythonMenuSideBar role={loaderData?.role} />
      </aside>
      <div className='col-span-12 lg:col-span-9'>
        {loaderData?.role === 'admin' && (
          <div className='flex justify-end mx-4'>
            <Link to={`/python-programming/edit/${loaderData?.topic?.slug}`}>
              <div className='hover:bg-slate-100 p-2 rounded-lg cursor-pointer'>
                <span className='flex items-center'>
                  <PencilIcon />
                  <span className='text-sm text-slate-500 '>Edit Page</span>
                </span>
              </div>
            </Link>
          </div>
        )}
        <div
          dangerouslySetInnerHTML={{ __html: loaderData?.topic?.description }}
          className='prose prose-slate lg:prose-md max-w-none mb-24 prose-a:text-blue-600 siliguri-font'
        />
      </div>
    </div>
  )
}

export default TopicDetails
