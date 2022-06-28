import modalStyles from '@reach/dialog/styles.css'
import { ActionFunction, json, LinksFunction, LoaderFunction, redirect } from '@remix-run/node'
import {
  Form,
  Link,
  useActionData,
  useFetcher,
  useLoaderData,
  useTransition,
} from '@remix-run/react'
import { motion } from 'framer-motion'
import highlightCss from 'highlight.js/styles/atom-one-dark.css'
import moment from 'moment'
import quillCss from 'quill/dist/quill.snow.css'
import * as React from 'react'
import { ClientOnly } from 'remix-utils'
import { BackButton } from '~/components/button'
import EyeIcon from '~/components/icons/eye'
import { Spinner } from '~/components/icons/spinner'
import MenuDropDown from '~/components/menu-dropdown'
import Quill from '~/components/quill.client'
import ViewersModal from '~/components/viewers-modal'
import {
  addQuestionReader,
  createAnswer,
  getQuestionViewers,
  getSingleQuestion,
} from '~/utils/question.server'
import { getUserId } from '~/utils/session.server'

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: highlightCss },
    { rel: 'stylesheet', href: quillCss },
    { rel: 'stylesheet', href: modalStyles },
  ]
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await getUserId(request)
  if (!userId) {
    return redirect('/auth/login')
  }

  const res = await getSingleQuestion(params.slug as string)
  return {
    ...res,
    env: process.env.IMAGE_BB_KEY,
    userId: userId,
  }
}

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await getUserId(request)

  if (!userId) {
    return redirect('/auth/login')
  }

  const formData = await request.formData()
  const { answer, action } = Object.fromEntries(formData)

  if (action === 'getBlogViewers') {
    const res = await getQuestionViewers(params.slug as string)
    return json(res)
  }
  if (action === 'incrementView') {
    await addQuestionReader(params.slug as string, userId as string)
    return null
  }
  const res = await createAnswer(
    params.slug as string,
    JSON.parse(answer as string),
    userId as string,
  )

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
    username: string
  }
}

const SingleQuestion = () => {
  const { question, env, answers, userId } = useLoaderData()
  const [html, setHtml] = React.useState<string>()
  const [shouldQuillEmpty, setShouldQuillEmpty] = React.useState<boolean>(false)
  const [showDialog, setShowDialog] = React.useState(true)
  const transition = useTransition()
  const actionData = useActionData()

  const fetcher = useFetcher()

  React.useEffect(() => {
    if (actionData?.status === 201) {
      setShouldQuillEmpty(true)
    }
  }, [actionData?.status])

  React.useEffect(() => {
    const timer = setTimeout(() => {
      fetcher.submit({ action: 'incrementView' }, { method: 'post' })
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.div
      className='w-full md:w-2/3 mx-auto p-4'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <BackButton to='/question' />
      <div className='my-6 border-b border-gray-200 py-4'>
        <div className='flex justify-end items-center' title='See viewers'>
          <Form method='post'>
            <button
              type='submit'
              name='action'
              value='getBlogViewers'
              className='flex items-center space-x-1 cursor-pointer'
              onClick={() => setShowDialog(true)}
            >
              <EyeIcon />{' '}
              <small className='text-xs text-slate-500 font-medium'>{question.views}</small>
            </button>
          </Form>
          {question?.authorId === userId && (
            <MenuDropDown url={`/question/edit/${question.slug}`} />
          )}
        </div>
        <h1 className='text-2xl md:text-4xl font-extrabold text-slate-700 my-2'>
          {question.title}
        </h1>
        <div className='flex space-x-2 mt-2 items-center'>
          <img
            src={question.creator.profilePicture}
            alt={question.creator.name}
            className='h-10 w-10 rounded-xl object-cover'
          />
          <div>
            <Link
              prefetch='intent'
              to={`/user/${question.creator.username}`}
              className='font-medium text-sky-500'
            >
              {question.creator.name}
            </Link>
            <small className='block text-xs font-medium text-slate-500'>
              <Link
                prefetch='intent'
                to={`/user/${question.creator.username}`}
                className='text-sky-500'
              >
                {question.creator.name}
              </Link>{' '}
              asked {moment(question.createdAt).fromNow()}
            </small>
          </div>
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
              className='p-4 bg-white rounded-xl border border-slate-100 my-4'
            >
              <div className='flex items-center space-x-2'>
                <img
                  src={answer.creator.profilePicture}
                  alt={answer.creator.name}
                  className='h-12 w-12 rounded-full'
                />
                <div className='mb-4'>
                  <Link
                    prefetch='intent'
                    to={`/user/${answer.creator.username}`}
                    className='font-medium text-sky-500 text-sm block'
                  >
                    {answer.creator.name}
                  </Link>
                  <small className='font-medium text-slate-500'>
                    <Link
                      prefetch='intent'
                      to={`/user/${answer.creator.username}`}
                      className='text-sky-500'
                    >
                      {answer.creator.name}
                    </Link>{' '}
                    answered {moment(answer.answeredTime).fromNow()}
                  </small>
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
                defaultValue={'<p></p>'}
                setHtml={setHtml}
                env={env}
                shouldQuillEmpty={shouldQuillEmpty}
              />
              <input
                type='text'
                name='answer'
                value={JSON.stringify(html)}
                onChange={() => console.log('hello')}
                className='hidden'
              />
              <button
                type='submit'
                className='px-16 py-3 rounded-full bg-blue-600 text-white inline-block mt-8 text-center text-sm -tracking-tighter font-medium shadow-lg shadow-blue-500/30 hover:bg-blue-700'
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
      {actionData?.viewers && (
        <ViewersModal
          showDialog={showDialog}
          setShowDialog={setShowDialog}
          viewers={actionData?.viewers}
          pageName='question'
        />
      )}
    </motion.div>
  )
}

export default SingleQuestion
