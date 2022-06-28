import { json, LoaderFunction } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { H4, H5, Paragraph } from '~/components/typography'
import { getUserInfoByUsername } from '~/utils/user.server'

export const loader: LoaderFunction = async ({ params }) => {
  const res = await getUserInfoByUsername(params.username as string)
  return json(res)
}

const publicProfile = () => {
  const { user, blogs, questions } = useLoaderData()

  return (
    <div>
      <div>
        <img
          src={user?.profilePicture}
          alt={user?.name}
          className='h-40 w-40 rounded-full object-cover border-2 border-sky-400 block mx-auto'
        />
        <H4 className='text-center font-extrabold my-4'>{user?.name}</H4>
        <Paragraph>{user?.bio}</Paragraph>
      </div>
      <div>
        <H5>Recent blogs</H5>
        {blogs?.map((blog) => (
          <Link prefetch='intent' key={blog.id} to={`/blog/${blog.slug}`}>
            <Paragraph className='font-medium'>{blog.title}</Paragraph>
          </Link>
        ))}
      </div>
      <div>
        <H5>Recent Asked Question</H5>
        {questions?.map((question) => (
          <Link prefetch='intent' key={question.id} to={`/blog/${question.slug}`}>
            <Paragraph className='font-medium'>{question.title}</Paragraph>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default publicProfile
