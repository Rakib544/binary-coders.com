import { LoaderFunction } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { getAllQuestions } from '~/utils/question.server'
export const loader: LoaderFunction = async () => {
  const res = await getAllQuestions()
  return {
    ...res,
  }
}

const index = () => {
  const loaderData = useLoaderData()
  return (
    <div>
      <h2 className='text-3xl p-10'>This forums page</h2>
      <ul>
        {loaderData?.questions?.map((question) => (
          <Link
            to={`/question/${question.slug}`}
            key={question.slug}
            className='block my-2 text-blue-500'
          >
            {question.title}
          </Link>
        ))}
      </ul>
    </div>
  )
}

export default index
