import { json, LinksFunction, LoaderFunction, MetaFunction, redirect } from '@remix-run/node'
import { Form, useActionData, useLoaderData, useTransition } from '@remix-run/react'
import quillCss from 'quill/dist/quill.snow.css'
import * as React from 'react'
import CreatableSelect from 'react-select/creatable'
import { ClientOnly } from 'remix-utils'
import { Input, Label } from '~/components/form-elements'
import { Spinner } from '~/components/icons/spinner'
import Quill from '~/components/quill.client'
import { createQuestion } from '~/utils/question.server'
import { getUserInfo, requireUserId } from '~/utils/session.server'

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: quillCss }]
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
  const tags = JSON.parse(inputTag as string)?.map(
    (tag: { value: string; label: string }) => tag.value,
  )
  const res = await createQuestion(title.toString(), JSON.parse(html as string), userId, tags)
  if (res.status === 201) {
    await fetch(process.env.NOTIFICATION_SERVER_URL as string, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({ ...res.notificationStatus }),
    })
    return redirect(res?.url as string)
  }
  return {
    ...res,
  }
}

export const loader: LoaderFunction = async ({ request }) => {
  const res = await getUserInfo(request)

  if (res.userId === null) {
    return redirect('/auth/login')
  }
  return json({ env: process.env.IMAGE_BB_KEY })
}

export const meta: MetaFunction = () => {
  return {
    title: 'Ask question - Binary Coders',
    description: 'Asked any question which you might find very confusing to understand',
  }
}

const options = [
  { value: 'javascript', label: 'Javascript' },
  { value: 'react', label: 'React' },
  { value: 'remix.run', label: 'Remix.run' },
]

const create = () => {
  const { env } = useLoaderData()
  const [html, setHtml] = React.useState<string>()
  const transition = useTransition()
  const actionData = useActionData()

  const [selectedOption, setSelectedOption] = React.useState(null)

  return (
    <div className='px-4 md:px-20 my-10'>
      <ClientOnly fallback={<div style={{ width: 500, height: 300 }}></div>}>
        {() => (
          <Form method='post'>
            <Label htmlFor='title'>Enter title (Title must be written in english)</Label>
            <Input type='text' name='title' placeholder='Enter Title' />
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
              className='px-8 sm:px-12 py-2 sm:py-3  bg-blue-500 text-white rounded-lg text-sm font-medium shadow-lg hover:bg-blue-600 transition duration-200 shadow-blue-500/50'
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
