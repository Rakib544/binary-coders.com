import { LoaderFunction } from '@remix-run/node'
import { Link, useFetcher, useLoaderData, useLocation } from '@remix-run/react'
import * as React from 'react'
import QuestionCard from '~/components/question-card'
import SelectBox from '~/components/select'
import { getAllQuestions } from '~/utils/question.server'
import { getUserInfo } from '~/utils/session.server'

// utility function for getting page number
const getPage = (searchParams: URLSearchParams) => Number(searchParams.get('page') || '1')

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url)
  const page = getPage(new URL(request.url).searchParams)
  const { userId } = await getUserInfo(request)
  if (url.search === '?query=me') {
    const res = await getAllQuestions(userId as string, page)
    return {
      ...res,
      userId,
    }
  } else {
    const res = await getAllQuestions(null, page)
    return {
      ...res,
      userId,
    }
  }
}

type Question = {
  authorId: string
  createdAt: string
  description: string
  id: string
  slug: string
  tags: Array<string>
  title: string
  views: number
  comments: number
  creator: {
    username: string
    profilePicture: string
    name: string
  }
}

const options = [
  {
    id: 1,
    name: 'All Questions',
    url: '/question',
  },
  {
    id: 2,
    name: 'My Questions',
    url: '/question?query=me',
  },
]

const Index = () => {
  const loaderData = useLoaderData()
  const location = useLocation()
  const fetcher = useFetcher()

  const [pageNumber, setPageNumber] = React.useState(0)
  const [questions, setQuestions] = React.useState(loaderData?.questions)
  const [hasMore, setHasMore] = React.useState(true)

  const observer = React.useRef<IntersectionObserver>()
  const lastPostElementRef = React.useCallback(
    (node) => {
      if (observer?.current) observer?.current?.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0]?.isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1)
        }
      })
      if (node) observer?.current?.observe(node)
    },
    [hasMore, location.search, fetcher.data],
  )

  React.useEffect(() => {
    if (location.search === '?query=me') {
      fetcher.load(`/question?query=me&index&page=${pageNumber + 1}`)
    } else {
      fetcher.load(`/question?index&page=${pageNumber + 1}`)
    }
  }, [pageNumber])

  React.useEffect(() => {
    if (fetcher.data?.questions?.length === 0) {
      setHasMore(false)
      return
    }
    if (fetcher.data?.questions) {
      if (questions[0]?.title === fetcher.data?.questions[0]?.title) {
        return
      }

      if (location.search === '?query=me') {
        if (
          fetcher.data?.questions?.every((post: Question) => post.authorId === loaderData?.userId)
        ) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setQuestions((prevPosts: any) => {
            return [...new Set([...prevPosts, ...fetcher.data.questions])]
          })
        }
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setQuestions((prevPosts: any) => {
          return [...new Set([...prevPosts, ...fetcher.data.questions])]
        })
      }
    }
  }, [fetcher.data])

  React.useEffect(() => {
    setPageNumber(0)
    setHasMore(true)
    // eslint-disable-next-line no-unsafe-optional-chaining
    setQuestions([...loaderData?.questions])
  }, [location.search])
  return (
    <>
      <Link
        prefetch='intent'
        to='/question/create'
        className='inline-block md:hidden mx-2 bg-blue-500 py-3 px-12 rounded-xl text-white font-medium tracking-wide my-8 text-sm text-center'
      >
        Ask Question
      </Link>

      <div className='grid grid-cols-10 gap-0 lg:gap-4'>
        <aside className='col-span-10 hidden md:col-span-2 lg:col-span-3 md:flex justify-center'>
          <div className='w-full md:px-2 lg:px-16 my-10'>
            {loaderData?.userId && (
              <Link
                prefetch='intent'
                to='/question/create'
                className='block bg-blue-500 py-3 px-4 rounded-xl text-white font-medium tracking-wide my-8 text-sm text-center'
              >
                Ask question
              </Link>
            )}
            <Link
              to='/question'
              prefetch='intent'
              className={`block px-4 py-3 bg-white font-medium my-2 text-sm rounded-xl hover:ring-1 hover:ring-blue-500 hover:text-blue-500 transition duration-300 ${
                location.search === '' ? 'ring-1 ring-blue-500 text-blue-500' : ''
              }`}
            >
              All Questions
            </Link>
            {loaderData.userId && (
              <Link
                to='/question?query=me'
                prefetch='intent'
                className={`block px-4 py-3 bg-white font-medium my-2 text-sm rounded-xl hover:ring-1 hover:ring-blue-500 hover:text-blue-500 transition duration-300 ${
                  location.search === '?query=me' ? 'ring-1 ring-blue-500 text-blue-500' : ''
                }`}
              >
                My Questions
              </Link>
            )}
          </div>
        </aside>
        <div className='col-span-10 md:col-span-8 lg:col-span-7 px-4 md:px-4 lg:px-12'>
          <div>
            <SelectBox options={options} />
          </div>
          <div className='my-10'>
            {questions?.map((post: Question, index: number) => {
              if (questions.length === index + 1) {
                return (
                  <div ref={lastPostElementRef} key={post.slug}>
                    <QuestionCard key={post.slug} {...post} />
                  </div>
                )
              } else {
                return <QuestionCard key={post.slug} {...post} />
              }
            })}
            {fetcher.state === 'loading' && <p>Loading...</p>}
          </div>
        </div>
      </div>
    </>
  )
}

export default Index
