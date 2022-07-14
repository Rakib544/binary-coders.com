import slugify from 'slugify'
import { prisma } from './prisma.server'

export const createProblem = async (
  title: string,
  description: string,
  userId: string,
  tags: Array<string>,
) => {
  let slug = slugify(title).toLowerCase()

  if (slug.length === 0) {
    return {
      errorFor: 'title',
      status: 501,
      message: 'Title must be written in english',
    }
  }

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
        views: 0,
      },
    })
    return {
      status: 201,
      message: 'Question created Successful',
      url: `/problems/${problem.slug}`,
    }
  } catch (error) {
    throw new Error('Something went wrong. Please try again.')
  }
}

export const getAllProblems = async (tag: string, page: number) => {
  try {
    if (tag) {
      const problems = await prisma.problem.findMany({
        take: 5,
        skip: (page - 1) * 5,
        orderBy: {
          createdAt: 'desc',
        },
        where: {
          tags: {
            has: tag,
          },
        },
      })
      return {
        status: 200,
        problems,
      }
    } else {
      const problems = await prisma.problem.findMany({
        take: 5,
        skip: (page - 1) * 5,
        orderBy: {
          createdAt: 'desc',
        },
      })
      return {
        status: 200,
        problems,
      }
    }
  } catch (error) {
    throw new Error('Something went wrong. Please try again.')
  }
}

export const getSingleProblem = async (slug: string) => {
  const problem = await prisma.problem.findUnique({
    where: {
      slug,
    },
  })
  if (!problem) {
    throw new Response('Not Found', {
      status: 404,
    })
  }
  return {
    status: 200,
    problem,
  }
}

export const updateProblem = async (slug: string, title: string, description: string) => {
  try {
    const post = await prisma.problem.update({
      where: {
        slug,
      },
      data: {
        title,
        description,
      },
    })
    return {
      status: 200,
      url: `/problems/${post.slug}`,
    }
  } catch (error) {
    throw new Error('Something went wrong. Please try again.')
  }
}

export const addProblemReader = async (slug: string, id: string) => {
  const blog = await prisma.problemViews.findMany({
    where: {
      slug,
      viewerId: id,
    },
  })

  if (blog.length === 0) {
    await prisma.problemViews.create({
      data: {
        slug,
        viewerId: id,
      },
    })

    const result = await prisma.problem.findUnique({
      where: {
        slug,
      },
      select: {
        views: true,
      },
    })

    await prisma.problem.update({
      where: {
        slug,
      },
      data: {
        views: (result as { views: number }).views + 1,
      },
    })

    return {
      status: 200,
      message: 'Viewer added successful',
    }
  }

  return {
    status: 401,
    message: 'User already viewed this blog',
  }
}

export const getProblemViewers = async (slug: string) => {
  const viewers = await prisma.problemViews.findMany({
    where: {
      slug,
    },
    include: {
      viewer: {
        select: {
          username: true,
          name: true,
          profilePicture: true,
        },
      },
    },
  })

  if (viewers.length === 0) {
    return {
      totalViewers: 0,
      viewers: null,
    }
  }
  return {
    viewers,
  }
}

export const deleteProblems = async (slug: string) => {
  try {
    await prisma.problem.delete({
      where: {
        slug,
      },
    })
    return {
      status: 200,
      message: 'Problem deleted successful',
    }
  } catch (e) {
    return {
      status: 500,
      message: 'Internal server error. Please try again',
    }
  }
}
