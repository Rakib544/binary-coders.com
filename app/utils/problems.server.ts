import slugify from 'slugify'
import { prisma } from './prisma.server'

export const createProblem = async (
  title: string,
  description: string,
  userId: string,
  tags: Array<string>,
) => {
  let slug = slugify(title).toLowerCase()
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

    const problem = await prisma.problem.create({
      data: {
        title,
        slug,
        description,
        authorId: userId,
        tags: tags,
      },
    })
    return {
      status: 201,
      message: 'Question created Successful',
      url: `/problems/${problem.slug}`,
    }
  } catch (error) {
    return {
      status: 500,
      message: 'Something went wrong. Please try again',
    }
  }
}

export const getAllProblems = async () => {
  try {
    const problems = await prisma.problem.findMany()
    return {
      status: 200,
      problems,
    }
  } catch (error) {
    return {
      status: 'Something went wrong. Please try again',
    }
  }
}

export const getSingleProblem = async (slug: string) => {
  try {
    const problem = await prisma.problem.findUnique({
      where: {
        slug,
      },
    })
    return {
      status: 200,
      problem,
    }
  } catch (error) {
    return {
      status: 500,
      message: 'Something went wrong. Please try again',
    }
  }
}
