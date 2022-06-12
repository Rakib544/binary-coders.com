import { ActionFunction, json, LinksFunction, LoaderFunction, redirect } from '@remix-run/node'
import { Form, useLoaderData, useTransition } from '@remix-run/react'
import highlightCss from 'highlight.js/styles/atom-one-dark.css'
import quillCss from 'quill/dist/quill.snow.css'
import * as React from 'react'
import { ClientOnly } from 'remix-utils'
import { Input } from '~/components/form-elements'
import { Spinner } from '~/components/icons/spinner'
import Quill from '~/components/quill.client'
import { createBlogPost } from '~/utils/blog.server'
import { requireUserId } from '~/utils/session.server'

export const action: ActionFunction = async ({ request }) => {
  try {
    const userId = await requireUserId(request)
    const formData = await request.formData()
    const { title, html } = Object.fromEntries(formData)
    const res = await createBlogPost(title as string, html as string, userId)
    if (res.status === 201) {
      return redirect(res?.url as string)
    }
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

export const loader: LoaderFunction = async () => {
  return json({ env: process.env.IMAGE_BB_KEY })
}

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: quillCss },
  { rel: 'stylesheet', href: highlightCss },
]

const CreateBlogPost = () => {
  const [html, setHtml] = React.useState()
  const transition = useTransition()
  // const actionData = useActionData()
  const { env } = useLoaderData()
  return (
    <div className='px-20 my-10'>
      <ClientOnly fallback={<div style={{ width: 500, height: 300 }}></div>}>
        {() => (
          <Form method='post'>
            <Input type='text' name='title' placeholder='Enter Title' className='mb-10' />
            <input
              type='text'
              name='html'
              value={html}
              onChange={() => console.log('hello')}
              className='hidden'
            />
            <Quill setHtml={setHtml} defaultValue={'<p>Hello world</p>'} env={env} />
            <button type='submit' className='px-20 py-4 bg-blue-600 text-white rounded-full my-10'>
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

export default CreateBlogPost
