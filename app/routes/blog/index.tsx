import type { LoaderFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import Footer from '~/components/footer/footer'
import { getAllBlogPosts } from '~/utils/blog.server'

type PostProps = {
  id: string
  createdAt: string
  updatedAt: string
  title: string
  slug: string
  readTime: string
  html: string
  authorId: string
  comments: []
}

export const loader: LoaderFunction = async () => {
  const posts = await getAllBlogPosts()
  return {
    ...posts,
  }
}

const index = () => {
  const { posts } = useLoaderData()
  // console.log(loaderData)
  return (
    <div>
      <h2 className='text-3xl p-10'>This is blog page </h2>
      <div>
        {posts?.map((post: PostProps) => (
          <p key={post.id}>{post.title}</p>
        ))}
      </div>
      <Footer />
    </div>
  )
}

export default index
