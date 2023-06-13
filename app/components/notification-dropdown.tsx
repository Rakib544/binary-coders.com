import { Menu, Transition } from '@headlessui/react'
import { Link, useFetcher } from '@remix-run/react'
import moment from 'moment'
import * as React from 'react'
import { Fragment } from 'react'
import { io } from 'socket.io-client'
import NotificationIcon from './icons/notification-icon'

type Notification = {
  id: string
  createdAt: string
  viewedBy: string[]
  notificationCreatorId: string
  slug: string
  notificationFor: string
  creator: {
    username: string
    name: string
    profilePicture: string
  }
}

export default function NotificationDropDown({
  NOTIFICATION_SERVER_URL,
}: {
  NOTIFICATION_SERVER_URL: string
}) {
  // socket io implementation
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [socket, setSocket] = React.useState<any>()
  const [showNotification, setShowNotification] = React.useState(false)
  React.useEffect(() => {
    try {
      const s = io(NOTIFICATION_SERVER_URL, {
        transports: ['websocket'],
      })
      setSocket(s)

      return () => {
        s.disconnect()
      }
    } catch (error) {
      console.log(error)
    }
  }, [])

  socket
    ?.off('new_post')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .on('new_post', () => {
      setShowNotification(true)
    })

  const fetcher = useFetcher()
  const loadNotification = () => {
    fetcher.submit({ action: 'notification' }, { method: 'post' })
    setShowNotification(false)
  }

  return (
    <>
      <Menu as='div' className='relative inline-block text-left'>
        <div>
          <Menu.Button className='inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none'>
            <div className='relative cursor-pointer' onClick={loadNotification}>
              <NotificationIcon />
              {showNotification && (
                <div className='absolute -top-0.5 right-0'>
                  <span className='flex relative h-3 w-3'>
                    <span className='animate-ping absolute -top-0 inline-flex h-full w-full rounded-full bg-red-400 opacity-75'></span>
                    <span className='relative inline-flex rounded-full h-3 w-3 bg-red-500'></span>
                  </span>
                </div>
              )}
            </div>
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter='transition ease-out duration-100'
          enterFrom='transform opacity-0 scale-95'
          enterTo='transform opacity-100 scale-100'
          leave='transition ease-in duration-75'
          leaveFrom='transform opacity-100 scale-100'
          leaveTo='transform opacity-0 scale-95'
        >
          <Menu.Items className='origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 p-2 h-96 overflow-y-auto'>
            {fetcher.state !== 'idle' && <p>Loading...</p>}
            {fetcher?.data?.notifications?.length === 0 && <p>No notification found</p>}
            {fetcher?.data?.notifications?.length > 0 &&
              fetcher?.data?.notifications?.map((notification: Notification) => (
                <Link
                  to={`/${notification.notificationFor === 'blog' ? 'blog' : 'question'}/${
                    notification.slug
                  }`}
                  key={notification.id}
                  className='block hover:bg-slate-100 p-2 rounded-xl'
                >
                  <div className='grid grid-cols-10 '>
                    <div className='col-span-3'>
                      <img
                        src={notification.creator.profilePicture}
                        alt={notification.creator.username}
                        className='w-12 rounded-full h-12 object-cover mt-1'
                      />
                    </div>
                    <div className='col-span-7'>
                      <p className='text-sm text-slate-700'>
                        <Link
                          to={`/user/${notification.creator.username}`}
                          className='text-sky-500 font-medium'
                        >
                          {notification.creator.name}
                        </Link>{' '}
                        {notification.notificationFor === 'blog' && 'write a new blog'}
                        {notification.notificationFor === 'question' && 'Asked a question'}
                      </p>
                      <small className='text-xs font-medium'>
                        {moment(notification.createdAt).fromNow()}
                      </small>
                    </div>
                  </div>
                </Link>
              ))}
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  )
}
