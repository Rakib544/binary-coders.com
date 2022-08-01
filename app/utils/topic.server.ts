import readingTime from 'reading-time'
import slugify from 'slugify'
import { prisma } from './prisma.server'

export const createTopic = async (title: string, html: string) => {
  const slug = slugify(title).toLowerCase()

  if (slug.length === 0) {
    return {
      errorFor: 'title',
      status: 501,
      message: 'Title must be written in english',
    }
  }
  const { text } = readingTime(html)

  try {
    const checkSlugCount = await prisma.blogPosts.count({
      where: {
        slug: slug,
      },
    })
    if (checkSlugCount > 0) {
      return {
        status: 501,
        message: 'Already written on this topics',
      }
    }
    await prisma.topic.create({
      data: {
        title,
        slug,
        description: html,
        readTime: text,
      },
    })
    return {
      status: 201,
      url: `/python/${slug}`,
    }
  } catch (error) {
    throw new Error('Some went wrong. Please try again.')
  }
}

export const getSingleTopic = async (slug: string) => {
  const topic = await prisma.topic.findUnique({
    where: {
      slug,
    },
  })

  if (!topic) {
    throw new Response('User not found', {
      status: 404,
    })
  }

  return {
    topic,
    status: 200,
  }
}

export const updateTopic = async (slug: string, description: string) => {
  try {
    await prisma.topic.update({
      where: {
        slug,
      },
      data: {
        description,
        updatedAt: new Date(),
      },
    })

    return {
      status: 200,
      url: `/python/${slug}`,
    }
  } catch (error) {
    throw new Error('Something went wrong. Please try again.')
  }
}
