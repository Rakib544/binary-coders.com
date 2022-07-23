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
  const notification = await prisma.notification.findMany()
  console.log(notification)
}
