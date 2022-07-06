import { json, LoaderFunction } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import BlogCard from '~/components/blogCard'
import QuestionCard from '~/components/question-card'
import { Paragraph } from '~/components/typography'
import { getUserInfoByUsername } from '~/utils/user.server'

export type Post = {
  id: string
  createdAt: string
  updatedAt: string
  title: string
  slug: string
  readTime: string
  html: string
  authorId: string
  views: number
  creator: {
    username: string
    profilePicture: string
    name: string
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

export const loader: LoaderFunction = async ({ params }) => {
  const res = await getUserInfoByUsername(params.username as string)
  return json(res)
}

const publicProfile = () => {
  const { user, blogs, questions } = useLoaderData()

  return (
    <div className='mx-4 md:mx-6 lg:mx-10'>
      <div
        className={
          // eslint-disable-next-line quotes
          "bg-[url('/images/profile-bg.jpg')] bg-cover rounded-t-xl  shadow-sm"
        }
      >
        <div className='flex items-center space-x-4 backdrop-opacity-10 backdrop-invert bg-slate-900/90 py-6'>
          <img
            src={user?.profilePicture}
            alt={user?.name}
            className='h-32 w-32 rounded-full object-cover border-2 border-sky-400 transform translate-y-12 mx-6'
          />
          <h1 className='font-extrabold mt-20 text-3xl text-white'>{user?.name}</h1>
        </div>
      </div>
      <div className='h-12 bg-white rounded-b-xl shadow-sm'></div>

      {/* main part start here */}
      <div className='grid grid-cols-4 gap-8 my-10'>
        <div className='col-span-4 lg:col-span-1'>
          <div className='bg-white p-4 rounded-lg font-medium'>
            <Paragraph>{blogs?.length} blog written</Paragraph>
            <Paragraph>{questions?.length} question asked</Paragraph>
          </div>
          {/* about */}
          <div className='my-4 p-4 bg-white rounded-lg'>
            <h3 className='font-medium text-lg'>About</h3>
            <p className='my-2'>{user?.bio}</p>
            <ul>
              <li>Live at {user?.location}</li>
              <li>Email {user?.email}</li>
              <li>Studied at {user?.institute}</li>
            </ul>
          </div>
          {/* social */}
          <div className='my-4 p-4 bg-white rounded-lg'>
            <h3 className='font-medium text-lg'>Social</h3>

            <ul>
              {user?.githubLink && (
                <Link to={user?.githubLink || ''} className='block my-2 text-blue-500 underline'>
                  {user?.githubLink}
                </Link>
              )}
              {user?.websiteLink && (
                <Link to={user?.websiteLink || ''} className='block my-2 text-blue-500 underline'>
                  {user?.websiteLink}
                </Link>
              )}
            </ul>
          </div>
        </div>
        <div className='col-span-4 lg:col-span-3'>
          {blogs?.length > 0 && (
            <div>
              <h2 className='text-2xl text-slate-700 font-bold'>Recent written blogs</h2>
              <div>
                {blogs?.map((blog: Post) => (
                  <BlogCard key={blog.slug} {...blog} />
                ))}
              </div>
            </div>
          )}
          {questions?.length > 0 && (
            <div className='mt-10'>
              <h2 className='text-2xl text-slate-700 font-bold'>Recent asked questions</h2>
              <div>
                {questions?.map((question: Question) => (
                  <QuestionCard key={question.slug} {...question} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default publicProfile
