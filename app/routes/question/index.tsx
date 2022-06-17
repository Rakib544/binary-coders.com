import { LoaderFunction } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { motion, useReducedMotion } from 'framer-motion'
import { getAllQuestions } from '~/utils/question.server'

export const loader: LoaderFunction = async () => {
  const res = await getAllQuestions()
  return {
    ...res,
  }
}

type Answer = {
  answer: string
  answerCreatorId: string
  answeredBy: string
  answeredTime: string
}

type Question = {
  answers: Array<Answer>
  authorId: string
  createdAt: string
  description: string
  id: string
  slug: string
  tags: Array<string>
  title: string
  updatedAt: string
}

const Index = () => {
  const loaderData = useLoaderData()
  const shouldReduceMotion = useReducedMotion()

  const childVariants = {
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <motion.div
      className='px-4 md:px-20 lg:px-60 bg-slate-100 py-20'
      initial='initial'
      animate='visible'
      variants={{
        initial: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
      }}
    >
      <motion.div
        variants={childVariants}
        className='flex justify-between py-4 border-b border-gray-100 items-center'
      >
        <h2 className='text-xl md:text-3xl'>All Questions</h2>
        <Link
          to='/question/create'
          className='px-8 sm:px-12 py-2 sm:py-3  bg-blue-600 text-white rounded-full'
        >
          Ask Question
        </Link>
      </motion.div>
      <motion.ul variants={childVariants}>
        {loaderData?.questions?.map((question: Question) => (
          <motion.li variants={childVariants} key={question.slug}>
            <Link
              to={`/question/${question.slug}`}
              className='block my-2 shadow-sm border border-gray-100 p-4 rounded-md bg-white'
            >
              <div>
                <h2 className='text-lg font-medium'>{question.title}</h2>
                <div className='space-x-4'>
                  <small>Viewed - 0</small>
                  <small>Answered - {question?.answers.length}</small>
                </div>
                <ul className='flex space-x-2 my-2'>
                  {question.tags?.map((tag) => (
                    <li key={tag}>
                      <small className='px-2 py-1 rounded-md text-sky-600 bg-sky-400/10'>
                        {tag}
                      </small>
                    </li>
                  ))}
                </ul>
                <Link
                  to={`question/${question.slug}`}
                  className='text-sm text-sky-500 font-medium my-1 inline-block'
                >
                  View More &rarr;
                </Link>
              </div>
            </Link>
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  )
}

export default Index
