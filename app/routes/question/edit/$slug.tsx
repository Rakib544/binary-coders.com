import {
  ActionFunction,
  json,
  LinksFunction,
  LoaderFunction,
  MetaFunction,
  redirect,
} from '@remix-run/node'
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useParams,
  useTransition,
} from '@remix-run/react'
import quillCss from 'quill/dist/quill.snow.css'
import * as React from 'react'
import { ClientOnly } from 'remix-utils'
import { Input, Label } from '~/components/form-elements'
import { Spinner } from '~/components/icons/spinner'
import Quill from '~/components/quill.client'

import { getSingleQuestion, updateQuestion } from '~/utils/question.server'
import { getUserInfo } from '~/utils/session.server'

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: quillCss }]
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const { userId } = await getUserInfo(request)
  const res = await getSingleQuestion(params.slug as string)
  if (res?.question?.authorId !== userId) {
    return redirect('/question')
  }
  const data = { ...res, env: process.env.IMAGE_BB_KEY }
  return json(data)
}

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData()
  const { title, description } = Object.fromEntries(formData)

  if ((title as string).length < 2) {
    return {
      type: 'error',
      message: 'Title can not be less than 2 character',
    }
  }
  const res = await updateQuestion(
    params.slug as string,
    title as string,
    JSON.parse(description as string),
  )
  if (res.status === 200) {
    return redirect(res.url as string)
  }
}

export const meta: MetaFunction = ({ data }: { data: { question: { title: string } } }) => {
  return {
    title: `${data?.question?.title ? `Edit - ${data.question.title}` : '404 - Not found'}`,
    description: `${
      data?.question?.title
        ? `Edit - ${data.question.title} to make it outstanding`
        : '404 - Not found'
    }`,
  }
}

const editQuestion = () => {
  const loaderData = useLoaderData()
  const transition = useTransition()
  const actionData = useActionData()

  const [html, setHtml] = React.useState(loaderData?.question.description)

  return (
    <div className='px-4 md:px-6 lg:px-12 my-20'>
      <ClientOnly fallback={<div style={{ width: 500, height: 300 }}></div>}>
        {() => (
          <Form method='put'>
            <div className='my-12'>
              <Label htmlFor='title'>Title</Label>
              <Input
                name='title'
                placeholder='Enter title here'
                defaultValue={loaderData?.question?.title}
              />
              {actionData?.type === 'error' && (
                <small role='alert' className='text-red-500 my-2'>
                  {actionData?.message}
                </small>
              )}
            </div>
            <div className='mb-12'>
              <Quill
                setHtml={setHtml}
                defaultValue={loaderData?.question?.description}
                env={loaderData?.env}
              />
              <input
                type='text'
                name='description'
                value={JSON.stringify(html)}
                onChange={() => console.log()}
                className='hidden'
              />
            </div>
            <button
              type='submit'
              className='px-8 sm:px-12 py-2 sm:py-3  bg-blue-500 text-white rounded-lg text-sm font-medium shadow-lg hover:bg-blue-600 transition duration-200 shadow-blue-500/50 mb-8'
            >
              {transition.submission ? (
                <div className='flex justify-center items-center'>
                  <Spinner />
                  {transition.state}
                </div>
              ) : (
                'Update'
              )}
            </button>
          </Form>
        )}
      </ClientOnly>
    </div>
  )
}

export default editQuestion

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

export function CatchBoundary() {
  const params = useParams()
  return (
    <div className='justify-center flex items-center my-20'>
      <div className='text-center'>
        <img src='/images/not-found.svg' alt='not found' className='h-48 mx-auto' />
        <h1 className='text-3xl font-medium my-10'>
          No question found with this{' '}
          <span className='text-sky-500'>&quot;/{params.slug}&quot;</span> slug
        </h1>

        <Link
          to='/question'
          className='px-8 sm:px-12 py-2 sm:py-3  bg-blue-500 text-white rounded-lg text-sm font-medium shadow-lg hover:bg-blue-600 transition duration-200 shadow-blue-500/50 my-6'
        >
          Back to questions
        </Link>
      </div>
    </div>
  )
}
