import readingTime from 'reading-time'
import slugify from 'slugify'
import { prisma } from './prisma.server'

export const createBlogPost = async (title: string, html: string, authorId: string) => {
  let slug = slugify(title)
  const { text } = readingTime(html)

  try {
    const checkSlugCount = await prisma.blogPosts.count({
      where: {
        slug: slug,
      },
    })
    const totalBlogs = await prisma.blogPosts.count()
    if (checkSlugCount > 0) {
      slug = slug + '-' + (totalBlogs + checkSlugCount + 1)
    }
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

export const getSingleBlog = async (slug: string) => {
  const blog = await prisma.blogPosts.findUnique({
    where: {
      slug,
    },
  })

  const creatorInfo = await prisma.user.findUnique({
    where: {
      id: blog?.authorId,
    },
    select: {
      name: true,
      profilePicture: true,
    },
  })

  if (blog) {
    return {
      status: 200,
      blog,
      creatorInfo,
    }
  } else {
    return {
      status: 404,
      message: 'No blog found with this slug',
    }
  }
}
