import { json, LinksFunction, LoaderFunction, redirect } from '@remix-run/node'
import { Form, useLoaderData, useTransition } from '@remix-run/react'
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

export const action: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request)
  const formData = await request.formData()
  const { title, html, tags: inputTag } = Object.fromEntries(formData)
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

  const [selectedOption, setSelectedOption] = React.useState(null)

  return (
    <div className='px-20 my-10'>
      <ClientOnly fallback={<div style={{ width: 500, height: 300 }}></div>}>
        {() => (
          <Form method='post'>
            <Label htmlFor='title'>Enter title (Title must be written in english)</Label>
            <Input type='text' name='title' placeholder='Enter Title' className='mb-10 mt-2' />
            <input
              type='text'
              name='html'
              value={JSON.stringify(html)}
              onChange={() => console.log('hello')}
              className='hidden'
            />
            <Quill setHtml={setHtml} defaultValue={'<p>Hello world</p>'} env={env} />
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
            </div>
            <button
              type='submit'
              className='px-8 sm:px-12 py-2 sm:py-3  bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition duration-200 shadow-blue-500/50'
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
