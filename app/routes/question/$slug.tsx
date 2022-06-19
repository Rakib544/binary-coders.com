import { LinksFunction, LoaderFunction, redirect } from '@remix-run/node'
import { Form, useActionData, useLoaderData, useTransition } from '@remix-run/react'
import { motion } from 'framer-motion'
import highlightCss from 'highlight.js/styles/atom-one-dark.css'
import moment from 'moment'
import quillCss from 'quill/dist/quill.snow.css'
import * as React from 'react'
import { ClientOnly } from 'remix-utils'
import { Spinner } from '~/components/icons/spinner'
import Quill from '~/components/quill.client'
import { createAnswer, getSingleQuestion, incrementView } from '~/utils/question.server'
import { getUserId } from '~/utils/session.server'

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: quillCss },
    { rel: 'stylesheet', href: highlightCss },
  ]
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await getUserId(request)
  if (!userId) {
    return redirect('/auth/login')
  }

  await incrementView(params.slug as string, userId as string)
  const res = await getSingleQuestion(params.slug as string)
  return {
    ...res,
    env: process.env.IMAGE_BB_KEY,
  }
}

export const action: LoaderFunction = async ({ request, params }) => {
  const userId = await getUserId(request)

  const formData = await request.formData()
  const { answer } = Object.fromEntries(formData)
  const res = await createAnswer(params.slug as string, answer as string, userId as string)

  return {
    ...res,
  }
}

type Answer = {
  id: string
  answerCreatorId: string
  answeredBy: string
  answeredTime: string
  answer: string
  slug: string
  creator: {
    profilePicture: string
    name: string
  }
}

const SingleQuestion = () => {
  const { question, env, answers } = useLoaderData()
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
    <motion.div
      className='w-full md:w-2/3 mx-auto p-4'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
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
        className='prose prose-slate lg:prose-lg max-w-none mt-12 mb-32 prose-a:text-blue-600'
      />
      <h3 className='text-lg font-medium border-t border-slate-300 pt-3'>
        {answers?.length} Answers
      </h3>
      {/* replies section goes here */}
      <div className='my-10'>
        <div className='my-4'>
          {answers?.map((answer: Answer) => (
            <div
              key={new Date() + answer.answerCreatorId + Math.random()}
              className='py-4 border-b border-gray-200'
            >
              <div className='flex space-x-4'>
                <img
                  src={answer.creator.profilePicture}
                  alt={answer.creator.name}
                  className='h-12 w-12 rounded-full'
                />
                <div className='mb-4'>
                  <h3 className='font-medium'>{answer.creator.name}</h3>
                  <small>{moment(answer.answeredTime).fromNow()}</small>
                </div>
              </div>
              <div
                dangerouslySetInnerHTML={{ __html: answer.answer }}
                className='prose prose-slate  lg:prose-md max-w-none prose-a:text-blue-600'
              />
            </div>
          ))}
        </div>
      </div>
      {/* {showWriteComment && ( */}
      <div className='my-10 py-6'>
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
      {/* )} */}
    </motion.div>
  )
}

export default SingleQuestion
