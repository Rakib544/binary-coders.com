import { LoaderFunction } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { getAllProblems } from '~/utils/problems.server'

export const loader: LoaderFunction = async () => {
  const res = await getAllProblems()
  return {
    ...res,
  }
}

type Problem = {
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
    <div className='px-4 md:px-20 lg:px-60 bg-slate-100 py-20'>
      <div className='flex justify-between py-4 border-b border-gray-100 items-center'>
        <h2 className='text-xl md:text-3xl'>All Problems</h2>
        <Link
          to='/question/create'
          className='px-8 sm:px-12 py-2 sm:py-3  bg-blue-600 text-white rounded-full'
        >
          Set Problem
        </Link>
      </div>
      <ul>
        {loaderData?.problems?.map((problem: Problem) => (
          <Link
            to={`/problems/${problem.slug}`}
            key={problem.slug}
            className='block my-2 shadow-sm border border-gray-100 p-4 rounded-md bg-white'
          >
            <div>
              <h2 className='text-lg font-medium'>{problem.title}</h2>
              <ul className='flex space-x-2 my-2'>
                {problem.tags?.map((tag) => (
                  <li key={tag}>
                    <small className='px-2 py-1 rounded-md text-sky-600 bg-sky-400/10'>{tag}</small>
                  </li>
                ))}
              </ul>
              <Link
                to={`question/${problem.slug}`}
                className='text-sm text-sky-500 font-medium my-1 inline-block'
              >
                Solve Problem &rarr;
              </Link>
            </div>
          </Link>
        ))}
      </ul>
    </div>
  )
}

export default index
