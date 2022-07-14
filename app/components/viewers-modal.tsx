/* eslint-disable react/prop-types */
import { Dialog } from '@headlessui/react'
import { Link } from '@remix-run/react'
import { motion } from 'framer-motion'
import moment from 'moment'

import * as React from 'react'

interface ModalProps {
  id: string
  slug: string
  viewedAt: string
  viewerId: string
  viewer: {
    username: string
    name: string
    profilePicture: string
  }
}

interface Props {
  viewers: ModalProps[]
  onClose: () => void
  pageName: string
}

const ViewersModal = ({ viewers, onClose, pageName }: Props): JSX.Element => {
  return (
    <Modal onClose={onClose}>
      <div className='flex flex-col h-full pt-3 z-50'>
        <div className='px-3 pb-4 shadow-sm'>
          <div className='relative mt-5 text-center'>
            <span className='font-medium'>People watch this {pageName}</span>
            <div className='absolute inset-y-0 right-0'>
              <button className='mr-1 text-blue-500 focus:outline-none' onClick={onClose}>
                Cancel
              </button>
            </div>
          </div>
        </div>

        <div className='flex-1 overflow-y-scroll'>
          {!viewers ? (
            <div className='flex items-center justify-center pt-12'>loading...</div>
          ) : (
            <>
              <ul className='px-3 text-left'>
                {viewers.map((viewer: ModalProps) => (
                  <Link
                    prefetch='intent'
                    to={`/user/${viewer.viewer.username}`}
                    key={viewer.viewer.username}
                    className='my-4 w-full block'
                  >
                    <div className='flex items-center space-x-2'>
                      <img
                        src={viewer.viewer.profilePicture}
                        alt={viewer.viewer.name}
                        className='h-16 rounded-xl w-14 object-cover'
                      />
                      <div>
                        <Link
                          className='text-sky-500 font-medium'
                          to={`/user/${viewer.viewer.username}`}
                          prefetch='intent'
                        >
                          {viewer.viewer.name}
                        </Link>
                        <small className='text-xs font-medium block'>
                          Viewed {moment(viewer.viewedAt).fromNow()}
                        </small>
                      </div>
                    </div>
                  </Link>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </Modal>
  )
}

function Modal({
  onClose,
  children,
}: {
  onClose: () => void
  children: React.ReactNode | React.ReactNode[]
}) {
  return (
    <Dialog className='fixed inset-0 z-10' onClose={onClose} open={true}>
      <div className='flex flex-col justify-center h-full px-1 pt-4 text-center sm:block sm:p-0'>
        <Dialog.Overlay
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { duration: 0.4, ease: [0.36, 0.66, 0.04, 1] },
          }}
          exit={{
            opacity: 0,
            transition: { duration: 0.3, ease: [0.36, 0.66, 0.04, 1] },
          }}
          className='fixed inset-0 bg-black/40'
        />

        <motion.div
          initial={{ y: '100%' }}
          animate={{
            y: 0,
            transition: { duration: 0.4, ease: [0.36, 0.66, 0.04, 1] },
          }}
          exit={{
            y: '100%',
            transition: { duration: 0.3, ease: [0.36, 0.66, 0.04, 1] },
          }}
          className='z-0 flex flex-col w-full h-full bg-white rounded-t-lg shadow-xl'
        >
          {children}
        </motion.div>
      </div>
    </Dialog>
  )
}

export default ViewersModal
