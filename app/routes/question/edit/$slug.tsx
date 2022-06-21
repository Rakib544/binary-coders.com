import { ActionFunction, json, LinksFunction, LoaderFunction, redirect } from '@remix-run/node'
import { Form, useActionData, useLoaderData, useTransition } from '@remix-run/react'
import quillCss from 'quill/dist/quill.snow.css'
import * as React from 'react'
import { ClientOnly } from 'remix-utils'
import { Input, Label } from '~/components/form-elements'
import { Spinner } from '~/components/icons/spinner'
import Quill from '~/components/quill.client'

import { getSingleQuestion, updateQuestion } from '~/utils/question.server'

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: quillCss }]
}

export const loader: LoaderFunction = async ({ params }) => {
  const res = await getSingleQuestion(params.slug as string)
  return json({ ...res, env: process.env.IMAGE_BB_KEY })
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

const editQuestion = () => {
  const loaderData = useLoaderData()
  const transition = useTransition()
  const actionData = useActionData()
  console.log(actionData)

  const [html, setHtml] = React.useState(loaderData?.question.description)

  return (
    <div className='px-12'>
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
              className='px-8 sm:px-12 py-2 sm:py-3  bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition duration-200 shadow-blue-500/50 mb-8'
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
