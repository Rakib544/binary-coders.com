import { json, LinksFunction, LoaderFunction, MetaFunction, redirect } from '@remix-run/node'
import { Form, useActionData, useLoaderData, useTransition } from '@remix-run/react'
import quillCss from 'quill/dist/quill.snow.css'
import * as React from 'react'
import CreatableSelect from 'react-select/creatable'
import { ClientOnly } from 'remix-utils'
import { Input, Label } from '~/components/form-elements'
import { Spinner } from '~/components/icons/spinner'
import Quill from '~/components/quill.client'
import { createProblem } from '~/utils/problems.server'
import { getUserInfo, requireUserId } from '~/utils/session.server'

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: quillCss }]
}

export const meta: MetaFunction = () => {
  return {
    title: 'New Post - Binary Coders',
    description:
      'Set new problems to help new programming learners to solve some problems and gain some problems solving capabilities',
  }
}

export const action: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request)
  const formData = await request.formData()
  const { title, html, tags: inputTag } = Object.fromEntries(formData)

  if (title.toString().trim().length === 0) {
    return {
      errorFor: 'title',
      status: 501,
      message: 'Title can not be empty',
    }
  }
  if (html.toString().trim().length === 0) {
    return {
      errorFor: 'description',
      status: 501,
      message: 'Content can not be empty',
    }
  }
  if (inputTag === 'null') {
    return {
      errorFor: 'tags',
      status: 501,
      message: 'Please select a tags',
    }
  }

  const tags = JSON.parse(inputTag as string).map(
    (tag: { value: string; label: string }) => tag.value,
  )
  const res = await createProblem(title.toString(), JSON.parse(html as string), userId, tags)
  if (res.status === 201) {
    return redirect(res?.url as string)
  }
  return {
    ...res,
  }
}

export const loader: LoaderFunction = async ({ request }) => {
  const { userId, role } = await getUserInfo(request)

  if (role !== 'admin') {
    return redirect('/problems')
  }

  if (userId === null) {
    return redirect('/problems')
  }
  return json({ env: process.env.IMAGE_BB_KEY })
}

const options = [
  { value: 'variable', label: 'Variable' },
  { value: 'condition', label: 'Condition' },
  { value: 'array', label: 'Array' },
  { value: 'loop', label: 'Loop' },
  { value: 'function', label: 'Function' },
]

const create = () => {
  const { env } = useLoaderData()
  const [html, setHtml] = React.useState<string>()
  const transition = useTransition()
  const actionData = useActionData()

  const [selectedOption, setSelectedOption] = React.useState(null)

  return (
    <div className='px-4 md:px-6 lg:px-12 my-20'>
      <ClientOnly fallback={<div style={{ width: 500, height: 300 }}></div>}>
        {() => (
          <Form method='post'>
            <Label htmlFor='title'>Enter title (Title must be written in english)</Label>
            <Input type='text' name='title' placeholder='Enter Title' className='mb-1 mt-2' />
            {actionData?.status === 501 && actionData?.errorFor === 'title' && (
              <small className='text-red-500 mb-10 block'>{actionData?.message}</small>
            )}
            <p className='mb-10'></p>
            <input
              type='text'
              name='html'
              value={JSON.stringify(html)}
              onChange={() => console.log('hello')}
              className='hidden'
            />
            <Label htmlFor='description'>Content</Label>
            <Quill setHtml={setHtml} defaultValue={'<p></p>'} env={env} />
            {actionData?.status === 501 && actionData?.errorFor === 'description' && (
              <small className='block text-red-500'>{actionData?.message}</small>
            )}
            <div className='my-4 md:w-1/2'>
              <Label htmlFor='select'>Add tags</Label>
              <input
                type='text'
                value={JSON.stringify(selectedOption) || ''}
                name='tags'
                className='hidden'
                onChange={() => console.log('hello')}
              />
              <CreatableSelect isMulti onChange={setSelectedOption} options={options} />
              {actionData?.status === 501 && actionData?.errorFor === 'tags' && (
                <small className='text-red-500 mb-10 block'>{actionData?.message}</small>
              )}
            </div>
            <button
              type='submit'
              className='px-8 sm:px-12 py-2 font-medium text-sm sm:py-3  bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition duration-200 shadow-blue-500/50'
            >
              {transition.submission ? (
                <div className='flex justify-center items-center'>
                  <Spinner />
                  {transition.state}
                </div>
              ) : (
                'Post'
              )}
            </button>
          </Form>
        )}
      </ClientOnly>
    </div>
  )
}

export default create

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
