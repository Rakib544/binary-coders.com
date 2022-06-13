import { LinksFunction, LoaderFunction } from '@remix-run/node'
import { Form, Link, useActionData, useLoaderData, useTransition } from '@remix-run/react'
import highlightCss from 'highlight.js/styles/atom-one-dark.css'
import quillCss from 'quill/dist/quill.snow.css'
import * as React from 'react'
import { ClientOnly } from 'remix-utils'
import { Spinner } from '~/components/icons/spinner'
import Quill from '~/components/quill.client'
import { createComment, getSingleQuestion } from '~/utils/question.server'
import { getUserId, getUserName } from '~/utils/session.server'

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: quillCss },
    { rel: 'stylesheet', href: highlightCss },
  ]
}

export const loader: LoaderFunction = async ({ params }) => {
  const res = await getSingleQuestion(params.slug as string)
  return {
    ...res,
    env: process.env.IMAGE_BB_KEY,
  }
}

export const action: LoaderFunction = async ({ request, params }) => {
  const username = await getUserName(request)
  const userId = await getUserId(request)

  const formData = await request.formData()
  const { answer } = Object.fromEntries(formData)
  const res = await createComment(
    params.slug as string,
    answer as string,
    userId as string,
    username as string,
  )

  return {
    ...res,
  }
}

type Answer = {
  answerCreatorId: string
  answeredBy: string
  answeredTime: string
  answer: string
}

const SingleQuestion = () => {
  const { question, env } = useLoaderData()
  const [html, setHtml] = React.useState<string>()
  const [shouldQuillEmpty, setShouldQuillEmpty] = React.useState<boolean>(false)
  const transition = useTransition()
  const actionData = useActionData()

  React.useEffect(() => {
    if (actionData?.status === 201) {
      setShouldQuillEmpty(true)
    }
  }, [actionData?.status])

  return (
    <div className='w-full md:w-2/3 mx-auto p-4'>
      <div className='my-6 border-b border-gray-200 py-4'>
        <h1 className='text-4xl font-bold'>{question.title}</h1>
        <div className='space-x-4'>
          <small>Asked - {new Date(question?.createdAt).toDateString()}</small>
          <small>Modified - {new Date(question?.updatedAt).toDateString()}</small>
          <small>Viewed - {question?.view.length} times</small>
        </div>
      </div>
      <div
        dangerouslySetInnerHTML={{ __html: question.description }}
        className='prose prose-slate lg:prose-md mt-12 mb-32'
      />
      {/* replies section goes here */}
      <div className='my-10'>
        <h3 className='text-lg font-medium'>{question?.answers?.length} Answers</h3>
        <div className='my-4'>
          {question?.answers?.map((answer: Answer) => (
            <div
              key={new Date() + answer.answerCreatorId + Math.random()}
              className='prose prose-slate lg:prose-md my-2 py-4 border-b border-gray-200'
            >
              <div dangerouslySetInnerHTML={{ __html: answer.answer }} />
              <div className='text-right'>
                <small className='block'>Answered </small>
                <small>
                  Answered by{' '}
                  <Link to={`/users/${answer.answerCreatorId}`} className='text-blue-500'>
                    {answer?.answeredBy}
                  </Link>
                </small>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='my-10 border-t border-gray-200 py-6'>
        <h3 className='text-xl font-medium mb-6'>Your Answer</h3>
        <ClientOnly fallback={<p>Loading...</p>}>
          {() => (
            <Form method='post'>
              <Quill
                defaultValue={'<p>Hello world</p>'}
                setHtml={setHtml}
                env={env}
                shouldQuillEmpty={shouldQuillEmpty}
              />
              <input
                type='text'
                name='answer'
                value={html}
                onChange={() => console.log('hello')}
                className='hidden'
              />
              <button
                type='submit'
                className='py-4 px-16 rounded-full bg-blue-500 text-white my-10'
              >
                {transition.submission ? (
                  <div className='flex justify-center items-center'>
                    <Spinner />
                    {transition.state}
                  </div>
                ) : (
                  'Post Your Answer'
                )}
              </button>
            </Form>
          )}
        </ClientOnly>
      </div>
    </div>
  )
}

export default SingleQuestion
