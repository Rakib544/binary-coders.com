/* eslint-disable prettier/prettier */
import slugify from 'slugify'
import { prisma } from './prisma.server'

export const createQuestion = async (
  title: string,
  html: string,
  authorId: string,
  tags: string[],
) => {
  let slug = slugify(title)

  if (slug.length === 0) {
    return {
      errorFor: 'title',
      status: 501,
      message: 'Title must be written in english',
    }
  }

  try {
    const checkSlugCount = await prisma.question.count({
      where: {
        slug: slug,
      },
    })
    const totalQuestion = await prisma.question.count()
    if (checkSlugCount > 0) {
      slug = slug + '-' + (totalQuestion + checkSlugCount + 1)
    }
    const question = await prisma.question.create({
      data: {
        title,
        slug,
        description: html,
        authorId,
        tags,
        views: 0,
        comments: 0,
      },
    })
    return {
      status: 201,
      url: `/question/${question.slug}`,
    }
  } catch (error) {
    return {
      status: 500,
      message: 'Something went wrong. Please try again',
    }
  }
}

export const getSingleQuestion = async (slug: string) => {
  const question = await prisma.question.findUnique({
    where: {
      slug,
    },
    include: {
      creator: {
        select: {
          username: true,
          profilePicture: true,
          name: true,
        },
      },
    },
  })

  const answers = await prisma.answers.findMany({
    where: {
      slug,
    },
    include: {
      creator: {
        select: {
          profilePicture: true,
          name: true,
          username: true,
        },
      },
    },
  })

  if (!question) {
    return {
      status: 404,
      message: 'Question not found with this slug',
    }
  }

  return {
    status: 200,
    question: question,
    answers,
  }
}

export const createAnswer = async (slug: string, answer: string, id: string) => {
  await prisma.answers.create({
    data: {
      slug,
      answer,
      answerCreatorId: id,
    },
  })

  const question = await prisma.question.findUnique({
    where: {
      slug,
    },
  })

  await prisma.question.update({
    where: {
      slug,
    },
    data: {
      comments: (question as { comments: number }).comments + 1,
    },
  })

  return {
    status: 201,
    message: 'Answer created successful',
  }
}

export const addQuestionReader = async (slug: string, id: string) => {
  const questions = await prisma.questionViews.findMany({
    where: {
      slug,
      viewerId: id,
    },
  })

  if (questions.length === 0) {
    await prisma.questionViews.create({
      data: {
        slug,
        viewerId: id,
      },
    })

    const result = await prisma.question.findUnique({
      where: {
        slug,
      },
      select: {
        views: true,
      },
    })

    await prisma.question.update({
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

export const getAllQuestions = async (userId: string | null) => {
  let id
  if (userId) {
    id = userId
  } else {
    id = undefined
  }
  try {
    const questions = await prisma.question.findMany({
      where: {
        authorId: id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        creator: {
          select: {
            username: true,
            profilePicture: true,
            name: true,
          },
        },
      },
    })
    return {
      questions,
      status: 200,
    }
  } catch (error) {
    return {
      status: 500,
      message: 'Something went wrong. Please try again',
    }
  }
}

export const updateQuestion = async (slug: string, title: string, description: string) => {
  try {
    const post = await prisma.question.update({
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
      url: `/question/${post.slug}`,
    }
  } catch (error) {
    return {
      status: 500,
      message: 'Something went wrong. Please try again.',
    }
  }
}

export const getQuestionViewers = async (slug: string) => {
  const viewers = await prisma.questionViews.findMany({
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
