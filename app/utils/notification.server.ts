import { prisma } from './prisma.server'

export const createNotification = async (
  notificationCreatorId: string,
  slug: string,
  notificationFor: string,
) => {
  await prisma.notification.create({
    data: {
      notificationCreatorId,
      slug,
      notificationFor: notificationFor,
    },
  })
}

export const getNotification = async () => {
  const notifications = await prisma.notification.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      creator: {
        select: {
          username: true,
          name: true,
          profilePicture: true,
        },
      },
    },
  })
  return notifications
}
