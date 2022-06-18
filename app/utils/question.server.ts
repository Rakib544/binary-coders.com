import slugify from 'slugify'
import { prisma } from './prisma.server'

export const createQuestion = async (
  title: string,
  html: string,
  authorId: string,
  tags: string[],
) => {
  let slug = slugify(title)

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

// export const createComment = async (slug: string, answer: string, id: string, username: string) => {
//   const comment = {
//     answerCreatorId: id,
//     answeredBy: username,
//     answer,
//   }
//   try {
//     await prisma.question.update({
//       where: {
//         slug,
//       },
//       data: {
//         answers: {
//           push: comment,
//         },
//       },
//     })

//     return {
//       status: 201,
//       message: 'Comment posted successful',
//     }
//   } catch (error) {
//     return {
//       status: 500,
//       message: 'Something went wrong. Please try again',
//     }
//   }
// }

export const createAnswer = async (slug: string, answer: string, id: string) => {
  await prisma.answers.create({
    data: {
      slug,
      answer,
      answerCreatorId: id,
    },
  })

  return {
    status: 201,
    message: 'Answer created successful',
  }
}

export const incrementView = async (slug: string, id: string) => {
  const post = await prisma.question.findUnique({
    where: {
      slug,
    },
  })

  const isAlreadyViewedPost = post?.view?.includes(id)
  if (!isAlreadyViewedPost) {
    await prisma.question.update({
      where: {
        slug,
      },
      data: {
        view: {
          push: id.toString(),
        },
      },
    })
  }
}

export const getAllQuestions = async () => {
  try {
    const questions = await prisma.question.findMany()
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
