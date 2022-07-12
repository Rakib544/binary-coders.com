import { json, LoaderFunction, MetaFunction } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import BlogCard from '~/components/blogCard'
import EmailLogo from '~/components/icons/email'
import GitHubLogo from '~/components/icons/github'
import LocationIcon from '~/components/icons/location'
import WebsiteLinkIcon from '~/components/icons/website-link'
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
  const data = { ...res }
  return json(data)
}

export const meta: MetaFunction = ({ data }: { data: { user: { name: string; bio: string } } }) => {
  return {
    title: `${data?.user?.name} - Binary Coders`,
    description: `${data?.user?.bio}`,
  }
}

const publicProfile = () => {
  const { user, blogs, questions } = useLoaderData()

  return (
    <div className='mx-4 md:mx-6 lg:mx-10'>
      <div
        className={
          // eslint-disable-next-line quotes
          "bg-[url('/images/profile-bg.jpg')] bg-cover"
        }
      >
        <div className='flex items-center space-x-4 backdrop-opacity-10 backdrop-invert bg-slate-900/90 py-6 rounded-t-xl'>
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
              {user?.location && (
                <li className='flex text-sm items-center space-x-1 my-1'>
                  <LocationIcon /> Live at <span className='font-medium'>{user?.location}</span>
                </li>
              )}
              <li className='flex items-center text-sm space-x-1 my-1'>
                <EmailLogo /> <span className='font-medium'>{user?.email}</span>
              </li>
              {user?.institute && (
                <li className='flex text-sm space-x-1 my-1'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    width='24'
                    height='24'
                  >
                    <path fill='none' d='M0 0h24v24H0z' />
                    <path d='M21 20h2v2H1v-2h2V3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v17zm-2 0V4H5v16h14zM8 11h3v2H8v-2zm0-4h3v2H8V7zm0 8h3v2H8v-2zm5 0h3v2h-3v-2zm0-4h3v2h-3v-2zm0-4h3v2h-3V7z' />
                  </svg>
                  <span>
                    Studied at <span className='font-medium'>{user?.institute}</span>
                  </span>
                </li>
              )}
            </ul>
          </div>
          {/* social */}
          <div className='my-4 p-4 bg-white rounded-lg'>
            <h3 className='font-medium text-lg'>Social</h3>

            <ul>
              {user?.githubLink && (
                <li className='flex items-center space-x-1'>
                  <GitHubLogo />
                  <a
                    href={user?.githubLink || ''}
                    className='text-blue-500 underline'
                    target='_blank'
                    rel='noreferrer'
                  >
                    {user?.githubLink}
                  </a>
                </li>
              )}
              {user?.websiteLink && (
                <li className='flex items-center space-x-1'>
                  <WebsiteLinkIcon />
                  <a
                    href={user?.websiteLink || ''}
                    className='block my-2 text-blue-500 underline'
                    target='_blank'
                    rel='noreferrer'
                  >
                    {user?.websiteLink}
                  </a>
                </li>
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

export function ErrorBoundary() {
  return (
    <div className='justify-center flex items-center my-20'>
      <div className='text-center'>
        <img src='/images/not-found.svg' alt='not found' className='h-48 mx-auto' />
        <h1 className='text-3xl font-medium my-10'>No user found with this username.</h1>

        <Link
          to='/'
          className='px-8 sm:px-12 py-2 sm:py-3  bg-blue-500 text-white rounded-lg text-sm font-medium shadow-lg hover:bg-blue-600 transition duration-200 shadow-blue-500/50 my-6'
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}
