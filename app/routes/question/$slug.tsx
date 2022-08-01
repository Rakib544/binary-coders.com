import modalStyles from '@reach/dialog/styles.css'
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
  useFetcher,
  useLoaderData,
  useParams,
  useTransition,
} from '@remix-run/react'
import { AnimatePresence, motion } from 'framer-motion'
import highlightCss from 'highlight.js/styles/atom-one-dark.css'
import moment from 'moment'
import quillCss from 'quill/dist/quill.snow.css'
import * as React from 'react'
import { ClientOnly } from 'remix-utils'
import { BackButton } from '~/components/button'
import EyeIcon from '~/components/icons/eye-icon'
import { Spinner } from '~/components/icons/spinner'
import MenuDropDown from '~/components/menu-dropdown'
import Modal from '~/components/modal'
import Quill from '~/components/quill.client'
import Reply from '~/components/reply'
import ViewersModal from '~/components/viewers-modal'
import {
  addQuestionReader,
  createAnswer,
  createAnswerReplies,
  deleteQuestion,
  getAnswerReplies,
  getQuestionViewers,
  getSingleQuestion,
} from '~/utils/question.server'
import { getUserId } from '~/utils/session.server'

const easing = [0.6, -0.05, 0.01, 0.99]

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
}

const fadeInUp = {
  initial: {
    y: 10,
    opacity: 0,
    transition: { duration: 0.6, ease: easing },
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
}

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: highlightCss },
    { rel: 'stylesheet', href: quillCss },
    { rel: 'stylesheet', href: modalStyles },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&display=swap',
    },
  ]
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await getUserId(request)
  // if (!userId) {
  //   return redirect('/auth/login')
  // }

  const res = await getSingleQuestion(params.slug as string)
  const data = {
    ...res,
    env: process.env.IMAGE_BB_KEY,
    userId: userId,
  }
  return json(data)
}

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await getUserId(request)

  // if (!userId) {
  //   return redirect('/auth/login')
  // }

  const formData = await request.formData()
  const { answer, action, reply, mainAnswerId } = Object.fromEntries(formData)

  if (action === 'getBlogViewers') {
    const res = await getQuestionViewers(params.slug as string)
    return json(res)
  }

  if (action === 'delete') {
    const res = await deleteQuestion(params.slug as string)
    if (res.status === 200) {
      return redirect('/question')
    }
  }

  if (action === 'incrementView') {
    if (userId) {
      await addQuestionReader(params.slug as string, userId as string)
    }
    return null
  }

  if (action === 'reply') {
    const res = await createAnswerReplies(
      mainAnswerId as string,
      reply as string,
      userId as string,
      params.slug as string,
    )
    return json(res)
  }

  if (action === 'loadReply') {
    const res = await getAnswerReplies(mainAnswerId as string)
    return json(res)
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

export const meta: MetaFunction = ({ data }: { data: { question: { title: string } } }) => {
  return {
    title: `${data?.question?.title || '404 - Not found'}`,
    description: `${data?.question?.title || '404 - Not found'}`,
  }
}

type Answer = {
  id: string
  answerCreatorId: string
  answeredBy: string
  answeredTime: string
  answer: string
  slug: string
  totalReplies: number
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
  const [open, setOpen] = React.useState(true)
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
      if (userId) {
        fetcher.submit({ action: 'incrementView' }, { method: 'post' })
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  const handleDelete = () => {
    fetcher.submit({ action: 'delete' }, { method: 'delete' })
  }

  // modal for delete question
  const [modalOpen, setModalOpen] = React.useState(false)

  const handleOpenModal = () => {
    setModalOpen(true)
  }

  return (
    <motion.div
      className='w-full md:w-2/3 mx-auto p-4'
      initial='initial'
      animate='animate'
      exit={{ opacity: 0 }}
    >
      <motion.div variants={stagger}>
        <motion.div variants={fadeInUp}>
          <BackButton to='/question' />
        </motion.div>
        <div className='my-6 border-b border-gray-200 py-4'>
          <motion.div variants={fadeInUp} className='flex justify-end items-center'>
            <Form method='post'>
              <button
                title='See viewers'
                type='submit'
                name='action'
                value='getBlogViewers'
                className='flex items-center space-x-1 cursor-pointer'
                onClick={() => setOpen(true)}
              >
                <EyeIcon />{' '}
                <small className='text-xs text-slate-500 font-medium'>{question.views}</small>
              </button>
            </Form>
            {question?.authorId === userId && (
              <MenuDropDown
                url={`/question/edit/${question.slug}`}
                handleOpenModal={handleOpenModal}
              />
            )}
          </motion.div>
          <motion.h1
            variants={fadeInUp}
            className='text-2xl md:text-4xl font-extrabold text-slate-700 my-2'
          >
            {question.title}
          </motion.h1>
          <motion.div variants={fadeInUp} className='flex space-x-2 mt-2 items-center'>
            <img
              src={question.creator.profilePicture}
              alt={question.creator.name}
              className='h-10 w-10 rounded-xl object-cover'
            />
            <div>
              <p className='font-medium text-slate-700'>{question.creator.name}</p>
              <small className='block text-xs font-medium text-slate-500'>
                <Link
                  prefetch='intent'
                  to={`/user/${question.creator.username}`}
                  className='text-sky-500'
                >
                  @{question.creator.username}
                </Link>{' '}
                asked {moment(question.createdAt).fromNow()}
              </small>
            </div>
          </motion.div>
        </div>
        <motion.div
          variants={fadeInUp}
          dangerouslySetInnerHTML={{ __html: question.description }}
          className='prose prose-slate lg:prose-lg max-w-none mt-12 mb-32 prose-a:text-blue-600 siliguri-font'
        />

        <motion.h3
          variants={fadeInUp}
          className='text-lg font-medium border-t border-slate-300 pt-3'
        >
          {question.comments} Answers
        </motion.h3>
      </motion.div>
      {/* replies section goes here */}
      <div className='my-10'>
        <div className='my-4'>
          {answers?.map((answer: Answer) => (
            <Reply answer={answer} key={answer.id} userId={userId} />
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
                height='200px'
              />
              <input
                type='text'
                name='answer'
                value={JSON.stringify(html)}
                onChange={() => console.log('hello')}
                className='hidden'
              />
              {userId ? (
                <button
                  type='submit'
                  className='px-8 sm:px-12 py-2 sm:py-3  bg-blue-500 text-white rounded-lg text-sm font-medium shadow-lg hover:bg-blue-600 transition duration-200 shadow-blue-500/50 my-6'
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
              ) : (
                <p className='mt-4 font-medium'>
                  Please{' '}
                  <Link to='/auth/login' className='text-sky-500'>
                    Sing in
                  </Link>{' '}
                  or{' '}
                  <Link to='/auth/send-register-link' className='text-sky-500'>
                    create an account
                  </Link>{' '}
                  to answer this question
                </p>
              )}
            </Form>
          )}
        </ClientOnly>
      </div>
      <Modal open={modalOpen} setOpen={setModalOpen}>
        <div className='bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
          <div className='sm:flex sm:items-start'>
            <div className='mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10'>
              <svg
                className='h-6 w-6 text-red-600'
                x-description='Heroicon name: outline/exclamation'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='2'
                stroke='currentColor'
                aria-hidden='true'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                ></path>
              </svg>
            </div>
            <div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
              <h3 className='text-lg leading-6 font-medium text-gray-900'>Delete Question</h3>
              <div className='mt-2'>
                <p className='text-sm text-gray-500'>
                  Are you sure you want to delete your question? This question will be permanently
                  removed. This action cannot be undone.
                </p>
              </div>
            </div>
          </div>
          <div className='py-6 sm:px-6 sm:flex sm:flex-row-reverse'>
            <button
              type='button'
              className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm'
              onClick={handleDelete}
            >
              Delete
            </button>
            <button
              type='button'
              className='mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
      <AnimatePresence>
        {actionData?.viewers && open && (
          <ViewersModal
            viewers={actionData?.viewers}
            onClose={() => setOpen(false)}
            pageName='problems'
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default SingleQuestion

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
