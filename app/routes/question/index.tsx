import { LoaderFunction } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
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

const index = () => {
  const loaderData = useLoaderData()
  return (
    <div className='mx-8 my-12'>
      <div className='flex justify-between py-4 border-b border-gray-100 items-center'>
        <h2 className='text-3xl'>All Questions</h2>
        <Link to='/blog/create' className='px-12 py-3 bg-blue-600 text-white rounded-full'>
          Create Blog
        </Link>
      </div>
      <ul>
        {loaderData?.questions?.map((question: Question) => (
          <Link
            to={`/question/${question.slug}`}
            key={question.slug}
            className='block my-6 border-b border-gray-100 py-4'
          >
            <div className='grid grid-cols-6'>
              <div className='col-span-1'>
                <small className='block'>Votes- 0</small>
                <small className='block'>Views- 0</small>
                <small className='block'>Answers- {question.answers.length}</small>
              </div>
              <div className='col-span-5'>
                <h2 className='text-blue-700 text-lg'>{question.title}</h2>
                <ul className='flex space-x-2 my-2'>
                  {question.tags?.map((tag) => (
                    <li key={tag} className='bg-sky-500/10 text-blue-400 px-2 py-1 rounded-md'>
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Link>
        ))}
      </ul>
    </div>
  )
}

export default index
