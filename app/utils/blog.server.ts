import readingTime from 'reading-time'
import slugify from 'slugify'
import { prisma } from './prisma.server'
export const createBlogPost = async (title: string, html: string, authorId: string) => {
  const slug = slugify(title)
  const { text } = readingTime(html)

  // const test = await prisma.blogPosts.findUnique({
  //   where: {
  //     slug: slug,
  //   },
  // })

  try {
    await prisma.blogPosts.create({
      data: {
        title,
        slug,
        html,
        readTime: text,
        authorId,
      },
    })

    return {
      status: 201,
      message: 'Post created successful',
    }
  } catch (error) {
    return {
      status: 500,
      message: 'Something went wrong. Please try again',
    }
  }
}

export const getAllBlogPosts = async () => {
  const posts = await prisma.blogPosts.findMany()
  return {
    status: 200,
    posts,
  }
}
