import readingTime from 'reading-time'
import slugify from 'slugify'
import { prisma } from './prisma.server'

export const createBlogPost = async (title: string, html: string, authorId: string) => {
  let slug = slugify(title)
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
    const totalBlogs = await prisma.blogPosts.count()
    if (checkSlugCount > 0) {
      slug = slug + '-' + (totalBlogs + checkSlugCount + 1)
    }
    const blog = await prisma.blogPosts.create({
      data: {
        title,
        slug,
        html,
        readTime: text,
        authorId,
        views: 0,
      },
    })
    return {
      status: 201,
      url: `/blog/${blog.slug}`,
    }
  } catch (error) {
    return {
      status: 500,
      message: 'Something went wrong. Please try again',
    }
  }
}

export const getAllBlogPosts = async (userId: string | null, page: number) => {
  let id
  if (userId) {
    id = userId
  } else {
    id = undefined
  }

  const posts = await prisma.blogPosts.findMany({
    where: {
      authorId: id,
    },
    take: 5,
    skip: (page - 1) * 5,
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

  if (posts) {
    return {
      status: 200,
      posts,
    }
  } else {
    return {
      status: 404,
      message: 'No blog found',
    }
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
      username: true,
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

export const getBlogViewers = async (slug: string) => {
  const viewers = await prisma.blogPostViews.findMany({
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

export const updateBlog = async (slug: string, title: string, html: string) => {
  try {
    const post = await prisma.blogPosts.update({
      where: {
        slug,
      },
      data: {
        title,
        html,
      },
    })
    return {
      status: 200,
      url: `/blog/${post.slug}`,
    }
  } catch (error) {
    return {
      status: 500,
      message: 'Something went wrong. Please try again.',
    }
  }
}

export const addBlogReader = async (slug: string, id: string) => {
  const blog = await prisma.blogPostViews.findMany({
    where: {
      slug,
      viewerId: id,
    },
  })

  if (blog.length === 0) {
    await prisma.blogPostViews.create({
      data: {
        slug,
        viewerId: id,
      },
    })

    const result = await prisma.blogPosts.findUnique({
      where: {
        slug,
      },
      select: {
        views: true,
      },
    })

    await prisma.blogPosts.update({
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

export const deleteBlog = async (slug: string) => {
  try {
    await prisma.blogPosts.delete({
      where: {
        slug,
      },
    })
    return {
      status: 200,
      message: 'Blog deleted successful',
    }
  } catch (e) {
    return {
      status: 500,
      message: 'Internal server error. Please try again',
    }
  }
}
