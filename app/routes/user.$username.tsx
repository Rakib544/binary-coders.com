import { json, LoaderFunction, MetaFunction } from '@remix-run/node'
import { Link, useLoaderData, useParams } from '@remix-run/react'
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

export const meta: MetaFunction = ({
  data,
}: {
  data: { user: { name: string; bio: string; profilePicture: string } }
}) => {
  return {
    title: `${data?.user?.name} - Binary Coders Profile`,
    description: `${data?.user?.bio}`,
    'og:title': `${data?.user?.name} - Binary Coders Profile`,
    'og:type': 'website',
    'og:url': 'https://binary-coders.vercel.app/about',
    'og:description': `${data?.user?.bio}`,
    'og:image': 'https://i.ibb.co/P69y7fJ/thumbnail.png',
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
        <div className='col-span-4 lg:col-span-1 '>
          <div className='bg-white p-4 rounded-lg shadow-2xl shadow-blue-500/10'>
            <Paragraph>{blogs?.length} blog written</Paragraph>
            <Paragraph>{questions?.length} question asked</Paragraph>
          </div>
          {/* about */}
          <div className='my-4 p-4 bg-white rounded-lg shadow-2xl shadow-blue-500/10'>
            <h3 className='font-medium text-lg text-slate-700'>About</h3>
            <p className='my-2 text-slate-500'>{user?.bio}</p>
            <ul>
              {user?.location && (
                <li className='grid grid-cols-10 text-sm my-1 text-slate-500'>
                  <span className='col-span-1 mt-1'>
                    <LocationIcon />
                  </span>{' '}
                  <div className='col-span-9'>
                    <span>Live at</span>{' '}
                    <span className='font-medium text-slate-500'>{user?.location}</span>
                  </div>
                </li>
              )}
              <li className='grid grid-cols-10 text-sm mt-1'>
                <span className='col-span-1 mt-1'>
                  <EmailLogo />
                </span>{' '}
                <span className='font-medium text-slate-500 col-span-9'>{user?.email}</span>
              </li>
              {user?.institute && (
                <li className='grid grid-cols-10 text-sm my-1'>
                  <span className='col-span-1'>
                    {' '}
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      width='16'
                      height='16'
                      className='mt-1'
                    >
                      <path fill='none' d='M0 0h24v24H0z' />
                      <path
                        d='M21 20h2v2H1v-2h2V3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v17zm-2 0V4H5v16h14zM8 11h3v2H8v-2zm0-4h3v2H8V7zm0 8h3v2H8v-2zm5 0h3v2h-3v-2zm0-4h3v2h-3v-2zm0-4h3v2h-3V7z'
                        fill='rgba(100,116,139,1)'
                      />
                    </svg>
                  </span>
                  <span className='text-slate-500 col-span-9'>
                    Studied at <span className='font-medium text-slate-500'>{user?.institute}</span>
                  </span>
                </li>
              )}
            </ul>
          </div>
          {/* social */}
          <div className='my-4 p-4 bg-white rounded-lg shadow-2xl shadow-blue-500/10'>
            <h3 className='font-medium text-lg'>Social</h3>

            <ul className='flex space-x-2 my-4'>
              {user?.githubLink && (
                <li className=''>
                  <a
                    href={user?.githubLink || ''}
                    className='text-blue-500 underline'
                    target='_blank'
                    rel='noreferrer'
                  >
                    <GitHubLogo />
                  </a>
                </li>
              )}
              {user?.websiteLink && (
                <li>
                  <a href={user?.websiteLink || ''} target='_blank' rel='noreferrer'>
                    <WebsiteLinkIcon />
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className='col-span-4 lg:col-span-3'>
          {blogs?.length === 0 && questions?.length === 0 && (
            <h2 className='text-2xl text-slate-700 font-bold'>
              The user didn&apos;t write any blog and didn&apos;t ask any questions.
            </h2>
          )}
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
          No user found with this{' '}
          <span className='text-sky-500'>&quot;/{params.username}&quot;</span> username
        </h1>

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
